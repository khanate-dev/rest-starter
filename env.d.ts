import { EnvironmentConfig } from '~/types';

declare namespace NodeJS {
	interface ProcessEnv extends EnvironmentConfig {
		NODE_ENV: 'development' | 'production' | 'test',
	}
}
