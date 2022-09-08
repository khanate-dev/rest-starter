import {
	AssertFunction,
	DetailedResponse,
	Jwt,
	ReadableTypeOf,
	Route,
	routeMethods,
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

export const assertRoute: AssertFunction<Route> = (value) => {

	const type = readableTypeOf(value);
	if (type !== 'object') {
		throw new TypeError(`expected 'object', received ${type}`);
	}

	const pathType = readableTypeOf(value.path);
	if (pathType !== 'string') {
		throw new TypeError(`path must be string, received ${pathType}`);
	}

	try {
		if (!/^\/[a-z0-9/\-_:]*$/i.test(value.path)) {
			throw new TypeError('path must start with \'/\' and be a valid uri string');
		}
		if (!routeMethods.includes(value.method)) {
			throw new TypeError(`method must be one of [${routeMethods.join(', ')}]`);
		}
		if (typeof value.handler !== 'function') {
			throw new TypeError('handler must be an async function');
		}
		if (typeof value.schema !== 'object') {
			throw new TypeError('schema must be a zod route schema object');
		}
	}
	catch (error: any) {
		throw new TypeError(`path '${value.path}': ${error.message}`);
	}

};

export const assertRoutes: AssertFunction<Route[]> = (value) => {
	const type = readableTypeOf(value);
	if (type !== 'array') {
		throw new TypeError(`expected 'array', received '${type}'`);
	}
	value.forEach(assertRoute);
};