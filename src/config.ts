import { z } from 'zod';

import { regex } from '~/constants.js';
import { objectEntries } from '~/helpers/object.helpers.js';
import { portSchema } from '~/helpers/schema.helpers.js';
import { logger } from '~/logger.js';

const envSchema = z
	.object({
		ACCESS_TOKEN_AGE: z
			.string()
			.regex(regex.age, 'invalid time string')
			.default('15m'),
		DATABASE_URL: z.string().regex(regex.mongoSrv),
		HASHING_ITERATIONS: z.preprocess(
			(value) => Number(value as string) || value,
			z.number().int().min(10000).max(10000000),
		),
		HASHING_PEPPER: z.string().min(32),
		NODE_ENV: z.enum(['development', 'production', 'test']),
		PORT: z
			.preprocess(
				(value) => Number(value as string) || value,
				portSchema.optional(),
			)
			.default(8000),
		PRIVATE_KEY: z.string().regex(regex.privateKey, 'invalid key'),
		PUBLIC_KEY: z.string().regex(regex.publicKey, 'invalid key'),
		REFRESH_TOKEN_AGE: z
			.string()
			.regex(regex.age, 'invalid time string')
			.default('1y'),
	})
	.strip();

const parseConfig = () => {
	const parsed = envSchema.safeParse(process.env);
	const mode = process.env.NODE_ENV ?? 'development';
	if (!parsed.success) {
		console.error(
			'🔥 Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
			`\n🔥 Fix the issues in .env.${mode} file.`,
			`\n💡 Tip: If you recently updated the .env.${mode} file and the error still persists, try restarting the server.`,
		);
		throw new Error('Invalid environment, Check terminal for more details ');
	}
	for (const [key, schema] of objectEntries(envSchema.shape)) {
		if (!schema.isOptional() || process.env[key] !== undefined) continue;
		logger.warn(
			`💡 Missing Environment: '${key}', Using Default: ${parsed.data[key]}`,
		);
	}

	return {
		dbUrl: parsed.data.DATABASE_URL,
		env: parsed.data.NODE_ENV,
		hashing: {
			iterations: parsed.data.HASHING_ITERATIONS,
			pepper: parsed.data.HASHING_PEPPER,
		},
		port: parsed.data.PORT,
		privateKey: parsed.data.PRIVATE_KEY,
		publicKey: parsed.data.PUBLIC_KEY,
		accessTokenAge: parsed.data.ACCESS_TOKEN_AGE,
		refreshTokenAge: parsed.data.REFRESH_TOKEN_AGE,
	} as const;
};

export type Config = ReturnType<typeof parseConfig>;

export const config = parseConfig();
