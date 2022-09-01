import z from 'zod';

const dbUriPattern = /^mongodb:\/\/[a-zA-Z0-9-_.:]+\/[a-zA-Z0-9-_.]+$/i;
const agePattern = /^[0-9]+\s?(years|year|yrs|y|weeks|week|w|days|day|d|hours|hour|hrs|hr|h|minutes|minute|mins|min|m|seconds|second|secs|sec|s|milliseconds|millisecond|msecs|msec|ms|m)?$/i;
const publicKeyPattern = /^-----BEGIN PUBLIC KEY-----.+-----END PUBLIC KEY-----$/s;
const privateKeyPattern = /^-----BEGIN RSA PRIVATE KEY-----.+-----END RSA PRIVATE KEY-----$/s;

export const environmentSchema = z.object({
	PORT: z.preprocess(
		value => Number(value as string) || value,
		z.number().int().positive().min(3000).max(9999).optional()
	),
	DB_URI: z.string().regex(dbUriPattern, 'invalid uri pattern'),
	HASHING_ITERATIONS: z.preprocess(
		value => Number(value as string) || value,
		z.number().int().min(10000).max(10000000)
	),
	HASHING_PEPPER: z.string().min(32),
	ACCESS_TOKEN_AGE: z.string().regex(agePattern, 'invalid time string').optional(),
	REFRESH_TOKEN_AGE: z.string().regex(agePattern, 'invalid time string').optional(),
	PUBLIC_KEY: z.string().regex(publicKeyPattern, 'invalid key'),
	PRIVATE_KEY: z.string().regex(privateKeyPattern, 'invalid key'),
});

export type Environment = z.infer<typeof environmentSchema>;