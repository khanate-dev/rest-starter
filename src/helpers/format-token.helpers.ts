import {
	alphabet,
	alphaNumeric,
	lowerAlphabet,
	numeric,
	upperAlphabet,
	wordSeparators,
} from '~/helpers/string-literals.helpers.js';

import type {
	Alphabet,
	AlphaNumeric,
	LowerAlphabet,
	Numeric,
	UpperAlphabet,
	WordSeparators,
} from '~/helpers/string-literals.helpers.js';

const formatStrategies = [
	'camel',
	'pascal',
	'snake',
	'kebab',
	'constant',
	'human',
] as const;

type Strategy = (typeof formatStrategies)[number];

const separatorMap = {
	camel: '',
	pascal: '',
	snake: '_',
	kebab: '-',
	constant: '_',
	human: ' ',
} as const;

type SeparatorMap = typeof separatorMap;

type Trim<T extends string> = T extends ` ${infer U}` | `${infer U} `
	? Trim<U>
	: T;

type Not<T, U> = T extends U ? false : true;

type NextLoop<
	C extends string,
	S extends Strategy,
	R extends string,
	F extends string,
> = R extends `${infer U}${infer V}` ? _InnerFormatToken<U, S, V, C, F> : F;

type _others<C extends string, S extends Strategy> = S extends 'constant'
	? Uppercase<C>
	: Lowercase<C>;

type _separate<
	C extends string,
	S extends Strategy,
> = `${SeparatorMap[S]}${S extends 'kebab' | 'snake' | 'human'
	? Lowercase<C>
	: Uppercase<C>}`;

type _separated<C extends string, S extends Strategy, L extends string = ''> = [
	C,
	L,
] extends [Alphabet, WordSeparators]
	? _separate<C, S>
	: [C, L] extends [UpperAlphabet, LowerAlphabet]
	? _separate<C, S>
	: [C, Not<L, Numeric>] extends [Numeric, true]
	? _separate<C, S>
	: _others<C, S>;

type _first<
	C extends string,
	S extends Strategy,
	L extends string = '',
	F extends string = '',
> = [L, F] extends ['', string] | [string, '']
	? S extends 'pascal' | 'constant'
		? Uppercase<C>
		: Lowercase<C>
	: _separated<C, S, L>;

type _alphaNum<
	C extends string,
	S extends Strategy,
	L extends string = '',
	F extends string = '',
> = C extends AlphaNumeric ? _first<C, S, L, F> : '';

type _InnerFormatToken<
	C extends string,
	S extends Strategy,
	R extends string,
	L extends string = '',
	F extends string = '',
> = NextLoop<C, S, R, `${F}${_alphaNum<C, S, L, F>}`>;

export type FormatToken<T extends string, S extends Strategy> = {
	[K in T]: Trim<K> extends ''
		? Trim<K>
		: Trim<K> extends `${infer U}${infer V}`
		? _InnerFormatToken<U, S, V>
		: Trim<K>;
}[T];

/**
 * Takes a token name, and format strategy and returns the converted token name
 * @param string the string to format
 * @param strategy - the strategy to format the string
 * @example formatToken('camelCaseString', 'kebab') => 'camel-case-string'
 */
export const formatToken = <
	T extends string,
	S extends Strategy,
	Return = FormatToken<T, S>,
>(
	input: T,
	strategy: S,
): Return => {
	const string = input.trim();
	if (!string) return '' as Return;

	let formatted = '';

	for (let index = 0; index < string.length; index++) {
		const current = string[index] as string;
		const last = string[index - 1];

		if (!alphaNumeric.includes(current)) continue;

		if (!last || !formatted) {
			formatted += ['pascal', 'constant'].includes(strategy)
				? current.toUpperCase()
				: current.toLowerCase();
		} else if (
			(alphabet.includes(current) && wordSeparators.includes(last)) ||
			(upperAlphabet.includes(current) && lowerAlphabet.includes(last)) ||
			(numeric.includes(current) && !numeric.includes(last))
		) {
			const char = ['kebab', 'snake', 'human'].includes(strategy)
				? current.toLowerCase()
				: current.toUpperCase();
			formatted += `${separatorMap[strategy]}${char}`;
		} else {
			formatted +=
				strategy === 'constant' ? current.toUpperCase() : current.toLowerCase();
		}
	}

	return formatted as Return;
};
