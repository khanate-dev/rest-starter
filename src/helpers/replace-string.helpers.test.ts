import { replaceString } from './replace-string.helpers.js';

test('test replaceString', () => {
	const first = {
		response: replaceString('example_string_value', '_', ' '),
		expected: 'example string value',
	} as const;
	expect(first.response).toBe(first.expected);
	assertType<typeof first.response>(first.expected);

	const second = {
		response: replaceString('example_string_value', ' ', '-'),
		expected: 'example_string_value',
	} as const;
	expect(second.response).toBe(second.expected);
	assertType<typeof second.response>(second.expected);
});
