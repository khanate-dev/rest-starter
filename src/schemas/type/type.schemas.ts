import z from 'zod';

import {
  AGE_REGEX,
  MONGO_URI_REGEX,
  PRIVATE_KEY_REGEX,
  PUBLIC_KEY_REGEX,
} from '~/config';

export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.preprocess(
    value => Number(value as string) || value,
    z.number().int().positive().min(1024).max(65535).optional()
  ),
  DB_URI: z.string().regex(MONGO_URI_REGEX, 'invalid uri pattern'),
  HASHING_ITERATIONS: z.preprocess(
    value => Number(value as string) || value,
    z.number().int().min(10000).max(10000000)
  ),
  HASHING_PEPPER: z.string().min(32),
  ACCESS_TOKEN_AGE: z.string().regex(AGE_REGEX, 'invalid time string').optional(),
  REFRESH_TOKEN_AGE: z.string().regex(AGE_REGEX, 'invalid time string').optional(),
  PUBLIC_KEY: z.string().regex(PUBLIC_KEY_REGEX, 'invalid key'),
  PRIVATE_KEY: z.string().regex(PRIVATE_KEY_REGEX, 'invalid key'),
});
