// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
	env: {
		es2021: true,
		node: true,
		jest: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['import', 'unused-imports'],
	rules: {
		indent: ['off', 'tab'],
		'no-console': [
			'error',
			{
				allow: ['warn', 'error', 'info'],
			},
		],
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'import/extensions': [
			'warn',
			'never',
			{
				helpers: 'always',
				test: 'always',
				styles: 'always',
			},
		],
		'import/no-duplicates': 'warn',
		'import/no-default-export': 'error',
		'object-shorthand': ['error', 'always'],
		'no-constant-condition': [
			'error',
			{
				checkLoops: false,
			},
		],
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['../*'],
						message: 'Usage of relative parent imports is not allowed.',
					},
				],
			},
		],
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			parserOptions: {
				project: './tsconfig.json',
			},
			plugins: ['@typescript-eslint'],
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {
				'@typescript-eslint-no-extra-semi': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-inferrable-types': 'off',
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						destructuredArrayIgnorePattern: '^_',
						caughtErrors: 'all',
					},
				],
				'@typescript-eslint/consistent-type-imports': [
					'error',
					{
						prefer: 'type-imports',
						fixStyle: 'separate-type-imports',
					},
				],
				'@typescript-eslint/no-unnecessary-condition': 'error',
			},
		},
		{
			files: ['*.test.ts'],
			extends: ['plugin:jest/all'],
			plugins: ['jest'],
			parserOptions: {
				project: ['./tsconfig.json'],
			},
			rules: {
				'jest/prefer-expect-assertions': 'off',
				'jest/require-top-level-describe': 'off',
			},
		},
	],
	settings: {
		'import/resolver': {
			typescript: {},
		},
		jest: {
			version: 29,
		},
	},
};

module.exports = config;
