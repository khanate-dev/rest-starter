// @ts-check

const { pathsToModuleNameMapper } = require('ts-jest'); // eslint-disable-line @typescript-eslint/no-var-requires
const { compilerOptions } = require('./tsconfig.json'); // eslint-disable-line @typescript-eslint/no-var-requires

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	clearMocks: true,
	collectCoverage: true,
	moduleNameMapper: pathsToModuleNameMapper(
		compilerOptions.paths,
		{ prefix: '<rootDir>' }
	),
};

module.exports = config;