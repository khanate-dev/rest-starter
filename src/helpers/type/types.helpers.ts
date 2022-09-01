import { strictObject } from 'zod';

import {
	AssertFunction,
	DetailedResponse,
	Jwt,
	ReadableTypeOf,
	RequestSchema,
	RequestSchemaInput,
	RequestSchemaInputObject,
	statusCodes,
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

const defaultObject = strictObject({});
type DefaultObject = typeof defaultObject;

export const requestSchema = <
	Body extends RequestSchemaInputObject = DefaultObject,
	Params extends RequestSchemaInputObject = DefaultObject,
	Query extends RequestSchemaInputObject = DefaultObject
>(
	{
		body = defaultObject as Body,
		query = defaultObject as Query,
		params = defaultObject as Params,
	}: RequestSchemaInput<Body, Params, Query>
): RequestSchema<Body, Params, Query> => {
	return strictObject({
		body,
		params,
		query,
	});
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

export const isDetailedResponse = <Type extends Record<string, any>>(
	value: Type | DetailedResponse<Type>
): value is DetailedResponse<Type> => {
	if (
		typeof value.status !== 'number'
		|| !statusCodes.includes(value.status)
		|| Boolean(value.json)
		|| typeof value.json !== 'object'
	) return false;
	return true;
};