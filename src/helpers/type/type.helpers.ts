import { getErrorMessage } from '~/helpers/error';
import { STATUS_CODES } from '~/helpers/http';
import { routeMethods } from '~/helpers/route';

import type { DetailedResponse, Route } from '~/helpers/route';
import type { Utils } from '~/types/utils';

export const readableTypeOf = (value: any) => {
	if (typeof value !== 'object') return typeof value;
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	return 'object';
};

export const isObject = (value: any): value is Obj =>
	readableTypeOf(value) === 'object';

export const assertObject: Utils.assertFunction<Obj> = (value) => {
	const type = readableTypeOf(value);
	if (type !== 'object')
		throw new TypeError(`Expected object, received ${type}`);
};

export const isArray = <Type = unknown>(
	value: any,
	checker?: (value: any) => value is Type,
): value is Type[] => {
	return Array.isArray(value) && (!checker || value.every(checker));
};

type AssertArray = <Type = unknown>(
	value: any,
	checker?: Utils.assertFunction<Type>,
) => asserts value is Type[];

export const assertArray: AssertArray = (value, checker) => {
	if (!Array.isArray(value))
		throw new TypeError(`Expected array, received ${readableTypeOf(value)}`);
	try {
		if (!value.length || !checker) return;
		value.forEach(checker);
	} catch (error: any) {
		throw new TypeError(
			`Invalid array member. ${
				error instanceof Error ? error.message : JSON.stringify(error)
			}`,
		);
	}
};

export const isDetailedResponse = (
	value: unknown,
): value is DetailedResponse<Obj | Obj[] | undefined> => {
	if (
		typeof value !== 'object' ||
		!value ||
		!('status' in value) ||
		!('json' in value) ||
		typeof value.status !== 'number' ||
		!STATUS_CODES.includes(value.status) ||
		!value.json ||
		typeof value.json !== 'object'
	)
		return false;
	return true;
};

export const assertRoute: Utils.assertFunction<Route> = (value) => {
	if (!isObject(value))
		throw new TypeError(`expected 'object', received ${readableTypeOf(value)}`);

	const pathType = readableTypeOf(value.path);
	if (pathType !== 'string')
		throw new TypeError(`path must be string, received ${pathType}`);

	try {
		if (
			typeof value.path !== 'string' ||
			!/^\/[a-z0-9/\-_:]*$/iu.test(value.path)
		)
			throw new TypeError("path must start with '/' and be a valid uri string");

		if (
			typeof value.method !== 'string' ||
			!routeMethods.includes(value.method)
		)
			throw new TypeError(`method must be one of [${routeMethods.join(', ')}]`);

		if (typeof value.handler !== 'function')
			throw new TypeError('handler must be an async function');

		if (typeof value.schema !== 'object')
			throw new TypeError('schema must be a zod route schema object');
	} catch (error) {
		throw new TypeError(
			`path '${String(value.path)}': ${getErrorMessage(error)}`,
		);
	}
};

export const assertRoutes: Utils.assertFunction<Route[]> = (value) => {
	if (!Array.isArray(value)) {
		throw new TypeError(
			`expected 'array', received '${readableTypeOf(value)}'`,
		);
	}
	value.forEach(assertRoute);
};
