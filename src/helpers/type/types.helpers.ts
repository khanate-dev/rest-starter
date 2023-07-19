import { getErrorMessage } from '~/helpers/error';
import { STATUS_CODES } from '~/helpers/http';
import { ROUTE_METHODS } from '~/types';

import type { DetailedResponse, Route } from '~/types';
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

export const isDetailedResponse = <Type extends Record<string, any>>(
	value: DetailedResponse<Type> | Type,
): value is DetailedResponse<Type> => {
	if (
		typeof value.status !== 'number' ||
		!STATUS_CODES.includes(value.status) ||
		!value.json ||
		typeof value.json !== 'object'
	)
		return false;
	return true;
};

export const assertRoute: AssertFunction<Route> = (value) => {
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
			!ROUTE_METHODS.includes(value.method)
		) {
			throw new TypeError(
				`method must be one of [${ROUTE_METHODS.join(', ')}]`,
			);
		}

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

export const assertRoutes: AssertFunction<Route[]> = (value) => {
	if (!Array.isArray(value)) {
		throw new TypeError(
			`expected 'array', received '${readableTypeOf(value)}'`,
		);
	}
	value.forEach(assertRoute);
};
