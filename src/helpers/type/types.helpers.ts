import z from 'zod';

import {
	AssertFunction,
	DetailedResponse,
	Jwt,
	ReadableTypeOf,
	ZodRequestSchema,
	RequestSchemaInput,
	ZodRequestObject,
	statusCodes,
	ZodRequestObjectOrArray,
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

const defaultObject = z.strictObject({});
type DefaultObject = typeof defaultObject;

export const requestSchema = <
	Body extends ZodRequestObjectOrArray = DefaultObject,
	Params extends ZodRequestObject = DefaultObject,
	Query extends ZodRequestObject = DefaultObject,
	Response extends ZodRequestObjectOrArray = DefaultObject,
	>(
		{
			body = defaultObject as Body,
			query = defaultObject as Query,
			params = defaultObject as Params,
			response = defaultObject as Response,
		}: RequestSchemaInput<Body, Params, Query, Response>
	): ZodRequestSchema<Body, Params, Query, Response> => {
	return z.strictObject({
		body,
		params,
		query,
		response,
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
		|| !value.json
		|| typeof value.json !== 'object'
	) return false;
	return true;
};