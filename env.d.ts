import type { Environment } from '~/schemas/environment';

declare namespace NodeJS {
	type ProcessEnv = Environment;
}
