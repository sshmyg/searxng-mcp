import { envSchema } from './schemas/env.ts';

export const env = envSchema.parse(process.env);
