// @ts-check

/** @type {import('eslint').Linter.Config} */
module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
		'unused-imports',
	],
	rules: {
		indent: ['off', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'comma-dangle': ['error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
			functions: 'never',
		}],
		'no-console': ['error', {
			allow: ['warn', 'error', 'info'],
		}],
		'no-multiple-empty-lines': ['error', {
			max: 1,
			maxEOF: 0,
			maxBOF: 0,
		}],
		'eol-last': ['error', 'always'],
		'quote-props': ['error', 'as-needed'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-unnecessary-type-constraint': 'off',
		'@typescript-eslint/member-delimiter-style': ['error', {
			multiline: {
				delimiter: 'comma',
				requireLast: true,
			},
			singleline: {
				delimiter: 'comma',
				requireLast: true,
			},
		}],
		'no-duplicate-imports': ['warn', {
			includeExports: true,
		}],
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
		],
		'@typescript-eslint/no-unused-vars': 'off',
	},
	overrides: [
		{
			files: ['*.test.ts'],
			extends: ['plugin:jest/all'],
			plugins: ['jest'],
			rules: {
				'jest/prefer-expect-assertions': 'off',
				'jest/require-top-level-describe': 'off',
			},
		},
	],
};
