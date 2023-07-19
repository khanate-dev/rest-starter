import { z, ZodError } from 'zod';

import {
	AGE_REGEX,
	MONGO_URI_REGEX,
	PRIVATE_KEY_REGEX,
	PUBLIC_KEY_REGEX,
} from '~/constants';
import { formatToken } from '~/helpers/string';
import { LOGGER } from '~/logger';

const ENVIRONMENT_SCHEMA = z.object({
	ACCESS_TOKEN_AGE: z
		.string()
		.regex(AGE_REGEX, 'invalid time string')
		.optional(),
	DATABASE_URL: z.string().regex(MONGO_URI_REGEX, 'invalid uri pattern'),
	HASHING_ITERATIONS: z.preprocess(
		(value) => Number(value as string) || value,
		z.number().int().min(10000).max(10000000),
	),
	HASHING_PEPPER: z.string().min(32),
	NODE_ENV: z.enum(['development', 'production', 'test']),
	PORT: z.preprocess(
		(value) => Number(value as string) || value,
		z.number().int().positive().min(1024).max(65535).optional(),
	),
	PRIVATE_KEY: z.string().regex(PRIVATE_KEY_REGEX, 'invalid key'),
	PUBLIC_KEY: z.string().regex(PUBLIC_KEY_REGEX, 'invalid key'),
	REFRESH_TOKEN_AGE: z
		.string()
		.regex(AGE_REGEX, 'invalid time string')
		.optional(),
});
/* eslint-enable @typescript-eslint/naming-convention */

const OPTIONAL_ENVIRONMENT = [
	'PORT',
	'ACCESS_TOKEN_AGE',
	'REFRESH_TOKEN_AGE',
] as const;

const DEFAULTS = {
	accessTokenAge: '15m',
	port: 8000,
	refreshTokenAge: '1y',
};

const parseConfig = () => {
	try {
		const env = ENVIRONMENT_SCHEMA.parse(process.env);

		for (const key of OPTIONAL_ENVIRONMENT) {
			if (process.env[key] === undefined) {
				const camelizedKey = formatToken(key, 'camel');
				LOGGER.warn(
					[
						`Optional Environment Variable '${key}' not provided`,
						`Using default: ${DEFAULTS[camelizedKey]}`,
					].join('. '),
				);
			}
		}

		return {
			accessTokenAge: env.ACCESS_TOKEN_AGE ?? DEFAULTS.accessTokenAge,
			dbUri: env.DATABASE_URL,
			env: env.NODE_ENV,
			hashing: {
				iterations: env.HASHING_ITERATIONS,
				pepper: env.HASHING_PEPPER,
			},
			port: env.PORT ?? DEFAULTS.port,
			privateKey: env.PRIVATE_KEY,
			publicKey: env.PUBLIC_KEY,
			refreshTokenAge: env.REFRESH_TOKEN_AGE ?? DEFAULTS.refreshTokenAge,
		} as const;
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`invalid environment:\n${error.issues
					.map((issue) => `'${issue.path[0] ?? ''}': ${issue.message}`)
					.join('\n')}`,
			);
		}
		throw new Error(`invalid environment: ${JSON.stringify(error)}`);
	}
};

export type Config = ReturnType<typeof parseConfig>;

export const CONFIG = parseConfig();
