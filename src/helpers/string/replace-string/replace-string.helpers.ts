export type ReplaceString<
	Str extends string,
	Search extends string,
	Replace extends string,
> = Str extends `${infer Prefix}${Search}${infer Suffix}`
	? `${Prefix}${Replace}${ReplaceString<Suffix, Search, Replace>}`
	: Str;

export const replaceString = <
	Str extends string,
	Search extends string,
	Replace extends string,
>(
	string: Str,
	searchValue: Search,
	replaceValue: Replace,
): ReplaceString<Str, Search, Replace> => {
	return string.replace(new RegExp(searchValue, 'gu'), replaceValue) as never;
};
