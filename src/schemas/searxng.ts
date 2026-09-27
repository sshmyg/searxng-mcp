import { z } from 'zod';

export const searxngResultSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  content: z.string().optional(),
});

export const searxngResponseSchema = z.object({
  results: z.array(searxngResultSchema).default([]),
});

export const webSearchInputSchema = z.object({
  query: z.string().trim().min(1).max(1_000),

  language: z.string().trim().min(2).max(32).optional(),

  maxResults: z.number().int().min(1).max(20).optional(),
});

export type WebSearchInput = z.infer<typeof webSearchInputSchema>;
