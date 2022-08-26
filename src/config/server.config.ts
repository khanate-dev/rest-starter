import logger from '~/helpers/logger';
import { assertType as assertTypeOf } from '~/helpers/type';

import { Config, EnvironmentConfig, ReadableTypeOf } from '~/types';

const {
	PORT,
	DB_URI,
	HASHING_ITERATIONS,
	HASHING_PEPPER,
	ACCESS_TOKEN_AGE,
	REFRESH_TOKEN_AGE,
	PUBLIC_KEY,
	PRIVATE_KEY,
} = process.env;

const requiredConfigs: Record<
	keyof EnvironmentConfig,
	ReadableTypeOf | ReadableTypeOf[]
> = {
	PORT: ['number', 'undefined'],
	DB_URI: 'string',
	HASHING_ITERATIONS: 'number',
	HASHING_PEPPER: 'string',
	ACCESS_TOKEN_AGE: ['string', 'undefined'],
	REFRESH_TOKEN_AGE: ['string', 'undefined'],
	PUBLIC_KEY: 'string',
	PRIVATE_KEY: 'string',
};

const defaults = {
	port: 8000,
	accessTokenAge: '15m',
	refreshTokenAge: '1y',
};

const parseConfig = (): Config => {

	for (const [key, type] of Object.entries(requiredConfigs)) {
		const label = `Environment Variable '${key}'`;
		const value = (
			(type === 'number' || type.includes('number')) && process.env[key]
				? Number(process.env[key])
				: process.env[key]
		);
		assertTypeOf(value, type, label);
		if (process.env[key] === undefined) {
			logger.warn(`Optional ${label} not provided. Using default: ${(defaults as any)[key]}`);
		}
	}

	return {
		port: Number(PORT) || defaults.port,
		dbUri: DB_URI as string,
		hashing: {
			iterations: Number(HASHING_ITERATIONS),
			pepper: HASHING_PEPPER as string,
		},
		accessTokenAge: ACCESS_TOKEN_AGE ?? defaults['accessTokenAge'],
		refreshTokenAge: REFRESH_TOKEN_AGE ?? defaults['refreshTokenAge'],
		publicKey: PUBLIC_KEY as string,
		privateKey: PRIVATE_KEY as string,
	};

};

const config = parseConfig();

export default config;