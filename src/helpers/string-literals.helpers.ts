import type { Utils } from '~/types/utils.types.js';

export const lowerAlphabet = 'abcdefghijklmnopqrstuvwxyz' as const;
export type LowerAlphabet = Utils.stringToUnion<typeof lowerAlphabet>;

export const upperAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;
export type UpperAlphabet = Utils.stringToUnion<typeof upperAlphabet>;

export const numeric = '0123456789' as const;
export type Numeric = Utils.stringToUnion<typeof numeric>;

export const alphabet = `${lowerAlphabet}${upperAlphabet}` as const;
export type Alphabet = LowerAlphabet | UpperAlphabet;

export const wordSeparators = ` \n-_.${numeric}` as const;
export type WordSeparators = Utils.stringToUnion<typeof wordSeparators>;

export const alphaNumeric = `${alphabet}${numeric}` as const;
export type AlphaNumeric = Alphabet | Numeric;
