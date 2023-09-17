import {
	alphabet,
	lowerAlphabet,
	upperAlphabet,
	wordSeparators,
} from '~/helpers/string-literals.helpers.js';

export const humanizeCases = ['lower', 'sentence', 'title', 'upper'] as const;

export type HumanizeCase = (typeof humanizeCases)[number];

/**
 * Takes a token name and returns a human readable string
 * @param string the string to humanize
 * @param casing - the casing for the humanized string. defaults to 'title'
 * @example humanizeToken('camelCaseString', 'sentence') => 'Camel case string'
 */
export const humanizeToken = (
	input: string,
	casing: HumanizeCase = 'title',
): string => {
	const string = input.trim();
	if (!string.trim()) return '';

	let formatted = '';

	for (let index = 0; index < string.length; index++) {
		const current = string[index] as string;
		const last = string[index - 1] as string;

		if (!alphabet.includes(current)) continue;

		if (!formatted) {
			switch (casing) {
				case 'lower': {
					formatted += current.toLowerCase();
					break;
				}
				case 'sentence':
				case 'title':
				case 'upper': {
					formatted += current.toUpperCase();
					break;
				}
			}
		} else if (
			(alphabet.includes(current) && wordSeparators.includes(last)) ||
			(upperAlphabet.includes(current) && lowerAlphabet.includes(last))
		) {
			formatted += ' ';
			switch (casing) {
				case 'lower':
				case 'sentence': {
					formatted += current.toLowerCase();
					break;
				}
				case 'title':
				case 'upper': {
					formatted += current.toUpperCase();
					break;
				}
			}
		} else {
			switch (casing) {
				case 'lower':
				case 'sentence':
				case 'title': {
					formatted += current.toLowerCase();
					break;
				}
				case 'upper': {
					formatted += current.toUpperCase();
					break;
				}
			}
		}
	}

	if (formatted.toLowerCase().endsWith(' id'))
		formatted = formatted.slice(0, -3);

	return formatted;
};
