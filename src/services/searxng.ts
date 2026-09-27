import { env } from '../config.ts';
import { searxngResponseSchema } from '../schemas/searxng.ts';

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchSearxng(
  query: string,
  language?: string,
  requestedMaxResults?: number,
): Promise<SearchResult[]> {
  const url = new URL('/search', env.SEARXNG_URL);

  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');

  if (language) {
    url.searchParams.set('language', language);
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
    signal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`SearXNG request failed: ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();
  const data = searxngResponseSchema.parse(json);

  const limit = Math.min(requestedMaxResults ?? env.MAX_RESULTS, env.MAX_RESULTS);

  return data.results.slice(0, limit).map((result) => ({
    title: result.title ?? '',
    url: result.url ?? '',
    content: result.content ?? '',
  }));
}
