import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

import type { JestConfigWithTsJest } from 'ts-jest';

// eslint-disable-next-line @typescript-eslint/naming-convention
const config: JestConfigWithTsJest = {
	clearMocks: true,
	collectCoverage: true,
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>',
	}),
	preset: 'ts-jest',
	testEnvironment: 'node',
};

// eslint-disable-next-line import/no-default-export
export default config;
