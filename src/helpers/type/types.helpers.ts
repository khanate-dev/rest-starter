import {
	AssertFunction,
	Jwt,
	ReadableTypeOf,
} from '~/types';

export const readableTypeOf = (
	value: any
): ReadableTypeOf => (
	typeof value !== 'object'
		? typeof value
		: value === null
			? 'null'
			: Array.isArray(value)
				? 'array'
				: 'object'
);

type AssertType = <Type extends ReadableTypeOf>(
	value: any,
	type: Type | Type[],
	name?: string,
) => asserts value is Type;

export const assertTypeOf: AssertType = (value, type, name) => {
	const checked = readableTypeOf(value);

	const typeArray = Array.isArray(type) ? type : [type];
	if (!typeArray.includes(checked as any)) {
		throw new Error(
			`Invalid ${name ?? 'value'}, expected '${typeArray.join(' | ')}', received '${checked}'`
		);
	}
	if (checked === 'number' && isNaN(value)) {
		throw new Error(
			`Invalid ${name ?? 'value'}, expected proper number`
		);
	}
};

export const assertJwt: AssertFunction<Jwt> = (
	value
) => {
	try {

		const type = readableTypeOf(value);
		if (type !== 'object') {
			throw new Error(`expected object, received ${typeof value}`);
		}

		const fields = ['_id', 'email', 'name', 'session'];
		const missing = fields.filter(field =>
			!value[field]
			|| typeof value[field] !== 'string'
		);
		if (missing.length > 0) {
			throw new Error(`missing or invalid values: ${missing.join(', ')}`);
		}

	}
	catch (error: any) {
		throw new TypeError(`Bad JWT! ${error.message}`);
	}
};