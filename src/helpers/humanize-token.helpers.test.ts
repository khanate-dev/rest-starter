import { humanizeCases, humanizeToken } from './humanize-token.helpers.js';

import type { HumanizeCase } from './humanize-token.helpers.js';

type Test = {
	input: string;
	output: Record<HumanizeCase, string>;
};

const tests: Test[] = [
	{
		input: 'thisIsSomeTestString',
		output: {
			lower: 'this is some test string',
			sentence: 'This is some test string',
			title: 'This Is Some Test String',
			upper: 'THIS IS SOME TEST STRING',
		},
	},
	{
		input: 'this is a VERY     badly   -----formatted.......## STRING.',
		output: {
			lower: 'this is a very badly formatted string',
			sentence: 'This is a very badly formatted string',
			title: 'This Is A Very Badly Formatted String',
			upper: 'THIS IS A VERY BADLY FORMATTED STRING',
		},
	},
	{
		input: '----SaleOrderID-----',
		output: {
			lower: 'sale order',
			sentence: 'Sale order',
			title: 'Sale Order',
			upper: 'SALE ORDER',
		},
	},
];

test.each(tests)('test humanizeToken helper', ({ input, output }) => {
	test(`should return ${output.title} for humanizeToken(${input})`, () => {
		const response = humanizeToken(input);
		expect(response).toStrictEqual(output.title);
	});
	test.each(humanizeCases)(
		'should return humanized string by the given casing',
		(casing) => {
			const response = humanizeToken(input, casing);
			expect(response).toStrictEqual(output[casing]);
		},
	);
});
