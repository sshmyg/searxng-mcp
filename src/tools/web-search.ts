import type { McpServer } from '@modelcontextprotocol/server';
import { webSearchInputSchema } from '../schemas/searxng.ts';
import { searchSearxng } from '../services/searxng.ts';

export function registerWebSearchTool(mcp: McpServer): void {
  mcp.registerTool(
    'web_search',
    {
      description:
        'Search the public web using SearXNG. Use this tool for current information, recent news, documentation, CVEs, software versions, prices, weather, and other time-sensitive facts.',
      inputSchema: webSearchInputSchema,
    },
    async ({ query, language, maxResults }) => {
      try {
        const results = await searchSearxng(query, language, maxResults);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ query, results }, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown search error';

        console.error('web_search failed:', error);

        return {
          content: [
            {
              type: 'text',
              text: `Web search failed: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
