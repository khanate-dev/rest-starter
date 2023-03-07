import {
	ALPHABET,
	ALPHA_NUMERIC,
	LOWER_CASE,
	NUMBERS,
	UPPER_CASE,
	WORD_SEPARATORS,
} from '~/helpers/string/string-literals';

export const FORMAT_STRATEGIES = [
	'camel',
	'pascal',
	'constant',
	'kebab',
	'snake',
] as const;

export type FormatStrategy = (typeof FORMAT_STRATEGIES)[number];

/**
 * Takes a token name, and format strategy and returns the converted token name
 * @param string the string to format
 * @param strategy - the strategy to format the string. defaults to 'camel'
 * @example formatToken('camelCaseString', 'kebab') => 'camel-case-string'
 */
export const formatToken = (
	input: string,
	strategy: FormatStrategy = 'camel'
): string => {
	const string = input.trim();
	if (!string) return '';

	let formatted = '';

	for (let index = 0; index < string.length; index++) {
		const current = string[index] as string;
		const last = string[index - 1];

		if (current === '.' && ALPHA_NUMERIC.includes(formatted.at(-1) ?? '')) {
			formatted += '.';
			continue;
		}

		if (!ALPHA_NUMERIC.includes(current)) continue;

		if (!formatted)
			switch (strategy) {
				case 'camel':
				case 'kebab':
				case 'snake': {
					formatted += current.toLowerCase();
					break;
				}
				case 'pascal':
				case 'constant': {
					formatted += current.toUpperCase();
					break;
				}
			}
		else if (
			(ALPHABET.includes(current) && last && WORD_SEPARATORS.includes(last)) ||
			(UPPER_CASE.includes(current) && last && LOWER_CASE.includes(last))
		)
			switch (strategy) {
				case 'camel': {
					formatted += current.toUpperCase();
					break;
				}
				case 'constant': {
					formatted += `_${current.toUpperCase()}`;
					break;
				}
				case 'kebab': {
					formatted += `-${current.toLowerCase()}`;
					break;
				}
				case 'pascal': {
					formatted += current.toUpperCase();
					break;
				}
				case 'snake': {
					formatted += formatted
						? `_${current.toLowerCase()}`
						: current.toLowerCase();
					break;
				}
			}
		else if (
			['kebab', 'snake', 'constant'].includes(strategy) &&
			NUMBERS.includes(current) &&
			formatted.at(-1) &&
			ALPHABET.includes(formatted.at(-1) ?? '')
		)
			formatted += `${strategy === 'kebab' ? '-' : '_'}${current}`;
		else
			switch (strategy) {
				case 'camel':
				case 'kebab':
				case 'pascal':
				case 'snake': {
					formatted += current.toLowerCase();
					break;
				}
				case 'constant': {
					formatted += current.toUpperCase();
					break;
				}
			}
	}

	if (formatted.at(-1) === '.') return formatted.slice(0, -1);

	return formatted;
};
