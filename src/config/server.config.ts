import { environmentSchema } from '~/schemas/type';

import logger from '~/helpers/logger';
import { formatString } from '~/helpers/string';

import { Config } from '~/types';

const optionalEnvironment = [
	'PORT',
	'ACCESS_TOKEN_AGE',
	'REFRESH_TOKEN_AGE',
] as const;

const defaults = {
	port: 8000,
	accessTokenAge: '15m',
	refreshTokenAge: '1y',
};

const parseConfig = (): Config => {
	try {

		const {
			NODE_ENV,
			PORT,
			DB_URI,
			HASHING_ITERATIONS,
			HASHING_PEPPER,
			ACCESS_TOKEN_AGE,
			REFRESH_TOKEN_AGE,
			PUBLIC_KEY,
			PRIVATE_KEY,
		} = environmentSchema.parse(process.env);

		for (const key of optionalEnvironment) {
			if (process.env[key] === undefined) {
				const camelizedKey = formatString(key, 'camel');
				logger.warn([
					`Optional Environment Variable '${key}' not provided`,
					`Using default: ${(defaults as any)[camelizedKey]}`,
				].join('. '));
			}
		}

		return {
			env: NODE_ENV,
			port: PORT || defaults.port,
			dbUri: DB_URI,
			hashing: {
				iterations: HASHING_ITERATIONS,
				pepper: HASHING_PEPPER,
			},
			accessTokenAge: ACCESS_TOKEN_AGE ?? defaults.accessTokenAge,
			refreshTokenAge: REFRESH_TOKEN_AGE ?? defaults.refreshTokenAge,
			publicKey: PUBLIC_KEY,
			privateKey: PRIVATE_KEY,
		};

	}
	catch (error: any) {
		throw new Error(
			`Invalid Environment:\n${JSON.parse(error.message)?.map?.(
				(error: any) => `'${error.path[0]}': ${error.message}`
			).join('\n')}`
		);
	}
};

export const config = parseConfig();
