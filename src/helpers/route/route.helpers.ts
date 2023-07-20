import { z } from 'zod';

import { validateAuth } from '~/helpers/auth';
import { getErrorResponseAndCode } from '~/helpers/error';
import { STATUS } from '~/helpers/http';
import { isDetailedResponse } from '~/helpers/type';
import { logger } from '~/logger';

import type { RequestHandler } from 'express';
import type { IncomingHttpHeaders } from 'http';
import type { Jwt } from '~/helpers/auth';
import type { Status } from '~/helpers/http';
import type { UserRole } from '~/schemas/user';
import type { Utils } from '~/types/utils';

export type ErrorResponse = {
	type: string;
	message: string;
};

type NonAuthLocals = EmptyObj;
type AuthLocals = { user: Jwt };

export type DetailedResponse<T extends Obj | Obj[] | undefined> = {
	status: Status;
	json: T;
};

export type RouteSchema<method extends RouteMethod> = {
	params?: Obj;
	query?: Obj;
	body?: method extends 'get' ? undefined : Obj | Obj[] | undefined;
	response?: Obj | Obj[] | undefined;
};

export type Handler<
	auth extends boolean,
	params extends Obj,
	query extends Obj,
	body extends Obj | Obj[] | undefined,
	response extends Obj | Obj[] | undefined,
> = (request: {
	locals: auth extends true ? AuthLocals : NonAuthLocals;
	params: params;
	query: query;
	body: body;
}) => Promise<DetailedResponse<response> | response>;

export type Middleware<auth extends boolean> = RequestHandler<
	never,
	ErrorResponse,
	never,
	never,
	auth extends true ? AuthLocals : NonAuthLocals
>;

export const routeMethods = ['get', 'post', 'put', 'patch', 'delete'] as const;

export type RouteMethod = (typeof routeMethods)[number];

type Coercible = 'string' | 'number' | 'boolean' | 'date';

type UrlObj = Record<string, Coercible>;

type UrlObjMap = {
	string: string;
	number: number;
	boolean: boolean;
	date: Date;
};

type UrlObjTransform<T extends UrlObj | undefined> = Utils.prettify<{
	[k in keyof T]: UrlObjMap[T[k]];
}>;

export type Contract<
	method extends RouteMethod = 'get',
	auth extends boolean = false,
	params extends UrlObj = EmptyObj,
	query extends UrlObj = EmptyObj,
	body extends Obj | Obj[] | undefined = undefined,
	response extends Obj | Obj[] | undefined = undefined,
> = {
	method: method;
	path: string;
	auth?: auth;
	availableTo?: auth extends true ? UserRole | UserRole[] : never;
	params?: params;
	query?: query;
	body?: method extends 'get' ? never : z.ZodSchema<body>;
	response: z.ZodSchema<response>;
	middleware?: Middleware<auth> | Middleware<auth>[];
};

type anyContract = Contract<
	RouteMethod,
	boolean,
	UrlObj,
	UrlObj,
	Obj | Obj[] | undefined,
	Obj | Obj[] | undefined
>;

export const createContract = <const T extends Record<string, anyContract>>(
	contract: T,
): T => contract;

type HandlerReturn<
	T extends Obj | Obj[] | undefined = Obj | Obj[] | undefined,
> = Promise<DetailedResponse<T> | T>;

type contractToHandler<T extends anyContract> = (request: {
	locals: T['auth'] extends true ? AuthLocals : NonAuthLocals;
	params: UrlObjTransform<T['params']>;
	query: UrlObjTransform<T['query']>;
	body: T['body'] extends z.ZodType ? z.infer<T['body']> : undefined;
	headers: IncomingHttpHeaders;
}) => HandlerReturn<z.infer<T['response']>>;

const transformUrlSchema = (obj: UrlObj | undefined): z.AnyZodObject => {
	if (!obj) return z.strictObject({});
	return z.strictObject({
		...Object.entries(obj).reduce(
			(acc, [key, type]) => ({ ...acc, [key]: z.coerce[type] }),
			{},
		),
	});
};

const asyncHandler = (
	schemas: {
		params: z.ZodSchema;
		query: z.ZodSchema;
		body: z.ZodSchema;
		response: z.ZodSchema;
	},
	handler: (details: {
		locals: Obj;
		params: Obj;
		query: Obj;
		body: Obj | Obj[] | undefined;
		headers: IncomingHttpHeaders;
	}) => HandlerReturn,
	auth?: boolean,
	availableTo?: UserRole | UserRole[],
) => {
	return (async (request, response) => {
		try {
			const validation = z.object(schemas).safeParse(request);
			if (!validation.success) {
				return response.status(STATUS.badRequest).json({
					type: 'validation-error',
					message: 'Invalid request',
					issues: validation.error.flatten(),
				});
			}

			const { params, query, body } = validation.data as never;

			if (auth) validateAuth(request, response, availableTo);

			const handlerResponse = (await handler({
				locals: response.locals,
				params,
				query,
				body,
				headers: request.headers,
			})) as unknown;

			const isDetailed = isDetailedResponse(handlerResponse);
			const status = isDetailed ? handlerResponse.status : STATUS.ok;
			const json = isDetailed ? handlerResponse.json : handlerResponse;
			response.status(status).json(json);
		} catch (error) {
			logger.error(error);
			const { status, json } = getErrorResponseAndCode(error);
			response.status(status).json(json);
		}
	}) as RequestHandler;
};

export type Route<contract extends anyContract = anyContract> = Utils.prettify<
	contract & { handler: RequestHandler }
>;

export type Routes<contract extends Record<string, anyContract> = EmptyObj> = {
	[k in keyof contract]: Route<contract[k]>;
};

export const createRoutes = <
	const contract extends Record<string, anyContract>,
	const handlers extends {
		[k in keyof contract]: contractToHandler<contract[k]>;
	},
>(
	contracts: contract,
	handlers: handlers,
): Routes<contract> => {
	return Object.entries(contracts).reduce((acc, [key, value]) => {
		const schemas = {
			params: transformUrlSchema(value.params),
			query: transformUrlSchema(value.query),
			body: value.body ?? z.undefined(),
			response: value.response,
		};
		const handler = asyncHandler(
			schemas,
			handlers[key] as never,
			value.auth,
			value.availableTo,
		);
		return {
			...acc,
			[key]: {
				...value,
				handler,
			},
		};
	}, {}) as never;
};
