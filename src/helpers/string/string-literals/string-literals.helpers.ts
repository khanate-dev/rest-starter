export const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz' as const;

export const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;

export const NUMBERS = '0123456789' as const;

export const ALPHABET = `${LOWER_CASE}${UPPER_CASE}` as const;

export const WORD_SEPARATORS = ` \n-_${NUMBERS}` as const;

export const ALPHA_NUMERIC = `${ALPHABET}${NUMBERS}` as const;
