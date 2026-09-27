import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(3344),
  SEARXNG_URL: z.url(),
  MAX_RESULTS: z.coerce.number().int().min(1).max(50).default(8),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(15_000),
});
