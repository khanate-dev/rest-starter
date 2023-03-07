import { FORMAT_STRATEGIES, formatToken } from './format-token.helpers';

import type { FormatStrategy } from './format-token.helpers';

interface Test {
	input: string;
	output: Record<FormatStrategy, string>;
}

const TESTS: Test[] = [
	{
		input: 'thisIsSomeTestString',
		output: {
			camel: 'thisIsSomeTestString',
			constant: 'THIS_IS_SOME_TEST_STRING',
			kebab: 'this-is-some-test-string',
			pascal: 'ThisIsSomeTestString',
			snake: 'this_is_some_test_string',
		},
	},
	{
		input: 'this is a VERY     badly   -----formatted.......## STRING.',
		output: {
			camel: 'thisIsAVeryBadlyFormatted.String',
			constant: 'THIS_IS_A_VERY_BADLY_FORMATTED._STRING',
			kebab: 'this-is-a-very-badly-formatted.-string',
			pascal: 'ThisIsAVeryBadlyFormatted.String',
			snake: 'this_is_a_very_badly_formatted._string',
		},
	},
	{
		input: '----SaleOrderID----',
		output: {
			camel: 'saleOrderId',
			constant: 'SALE_ORDER_ID',
			kebab: 'sale-order-id',
			pascal: 'SaleOrderId',
			snake: 'sale_order_id',
		},
	},
	{
		input: 'alpha-   1numeric',
		output: {
			camel: 'alpha1Numeric',
			constant: 'ALPHA_1_NUMERIC',
			kebab: 'alpha-1-numeric',
			pascal: 'Alpha1Numeric',
			snake: 'alpha_1_numeric',
		},
	},
	{
		input: '    Folder - file-2',
		output: {
			camel: 'folderFile2',
			constant: 'FOLDER_FILE_2',
			kebab: 'folder-file-2',
			pascal: 'FolderFile2',
			snake: 'folder_file_2',
		},
	},
	{
		input: 'api helpers.helpers.js',
		output: {
			camel: 'apiHelpers.helpers.js',
			constant: 'API_HELPERS.HELPERS.JS',
			kebab: 'api-helpers.helpers.js',
			pascal: 'ApiHelpers.helpers.js',
			snake: 'api_helpers.helpers.js',
		},
	},
];

describe.each(TESTS)('test formatString helper', ({ input, output }) => {
	it(`should return ${output.camel} for formatString(${input})`, () => {
		const response = formatToken(input);
		expect(response).toStrictEqual(output.camel);
	});
	it.each(FORMAT_STRATEGIES)(
		'should return valid formatted string by given parameters',
		(strategy) => {
			const response = formatToken(input, strategy);
			expect(response).toStrictEqual(output[strategy]);
		}
	);
});
