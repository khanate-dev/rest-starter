type FormatStrategy = (
	| 'camel'
	| 'pascal'
	| 'snake'
	| 'kebab'
	| 'constant'
);

type Casing = (
	| 'sentence'
	| 'title'
	| 'lower'
	| 'upper'
);

const formatString = (
	input: any,
	strategy: FormatStrategy = 'camel'
): string => {

	if (
		typeof input !== 'string'
		|| !input.trim()
	) return '';
	let newString = input.trim();

	const firstCharacter = (
		['pascal', 'constant'].includes(strategy)
			? newString[0]?.toUpperCase()
			: newString[0]?.toLowerCase()
	) ?? '';
	if (newString.length === 1) return firstCharacter;
	newString = `${firstCharacter}${newString.substring(1)}`;

	newString = newString.replace(/([-_. 0-9])([a-zA-Z]{1})/g, match => match.toUpperCase());
	newString = newString.replace(/(?<=[A-Z]{1})[A-Z]+/g, match => match.toLowerCase());
	newString = newString.replace(/[^A-Za-z0-9]/g, '');
	newString = newString.replace(/ID$/gi, '');

	if (strategy === 'snake') {
		return newString.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
	}
	else if (strategy === 'kebab') {
		return newString.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
	}
	else if (strategy === 'constant') {
		return newString.replace(/(?<=[a-z0-9])([A-Z])/g, '_$1').toUpperCase();
	}
	else {
		return newString;
	}

};

const humanizeString = (
	input: any,
	casing: Casing = 'title'
): string => {

	if (typeof input !== 'string' || !input) return '';

	if (input.length === 1) {
		return (
			casing !== 'lower'
				? input.toUpperCase()
				: input.toLowerCase()
		);
	}

	let formattedString = formatString(input, casing === 'lower' ? 'camel' : 'pascal');

	formattedString = formattedString.replace(/(?<=[a-z0-9])([A-Z])/g, match => (
		casing === 'title'
			? ` ${match}`
			: ` ${match.toLowerCase()}`
	));

	if (casing === 'upper') {
		return formattedString.toUpperCase();
	}

	return formattedString;

};

export {
	humanizeString,
	formatString,
};
