import { Request, Response, NextFunction } from 'express';
import z from 'zod';

import { Jwt } from '~/types/general';
import { Status } from '~/types/http';

export type ZodRequestObject = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
);

export type ZodRequestObjectOrArray = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodArray<
		z.ZodObject<Record<string, any>, 'strict'>
		| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	>
);

export interface RequestSchemaInput<
	Body extends z.ZodRecord | ZodRequestObjectOrArray,
	Params extends z.ZodRecord | ZodRequestObject,
	Query extends z.ZodRecord | ZodRequestObject,
	Response extends z.ZodRecord | ZodRequestObjectOrArray,
	> {
	body?: Body,
	params?: Params,
	query?: Query,
	response?: Response,
}

export type ZodRequestSchema<
	Body extends z.ZodRecord | ZodRequestObjectOrArray = z.ZodRecord | ZodRequestObjectOrArray,
	Params extends z.ZodRecord | ZodRequestObject = z.ZodRecord | ZodRequestObject,
	Query extends z.ZodRecord | ZodRequestObject = z.ZodRecord | ZodRequestObject,
	Response extends z.ZodRecord | ZodRequestObjectOrArray = z.ZodRecord | ZodRequestObjectOrArray,
	> = z.ZodObject<
		{
			body: Body,
			params: Params,
			query: Query,
			response: Response,
		}
		, 'strict'
	>;

interface RequestSchema {
	body: Record<string, any> | Record<string, any>[],
	params: Record<string, any>,
	query: Record<string, any>,
	response: Record<string, any> | Record<string, any>[] | void,
}
export interface DefaultSchema {
	body: Record<never, never>,
	params: Record<never, never>,
	query: Record<never, never>,
	response: void,
}

type PublicLocals = Record<never, never>;
type PrivateLocals = { user: Jwt, };

export interface DetailedResponse<Json extends RequestSchema['response']> {
	status: Status,
	json: Json,
}

export type CustomHandler<
	Locals extends PublicLocals | PrivateLocals,
	Schema extends RequestSchema,
	ReturnType = Schema['response'] | DetailedResponse<Schema['response']>
	> = (
		request: Request<
			Schema['params'],
			Schema['response'],
			Schema['body'],
			Schema['query'],
			Locals
		>,
		response: Response<
			Schema['response'],
			Locals
		>,
		next: NextFunction
	) => Promise<ReturnType>;

export type PublicHandler<
	Schema extends RequestSchema
	> = CustomHandler<
		PublicLocals,
		Schema
	>;

export type PrivateHandler<
	Schema extends RequestSchema,
	> = CustomHandler<
		PrivateLocals,
		Schema
	>;

export type Middleware<
	Handler extends _PublicHandler | _PrivateHandler
	> = CustomHandler<
		Handler extends _PublicHandler ? PublicLocals : PrivateLocals,
		DefaultSchema,
		DefaultSchema['response']
	>;

export type _PublicHandler = PublicHandler<any>;

export type _PrivateHandler = PrivateHandler<any>;

export type RouteMethod = (
	| 'all'
	| 'get'
	| 'post'
	| 'put'
	| 'patch'
	| 'delete'
);

interface BaseRoute {
	isPrivate?: boolean,
	method: RouteMethod,
	path: string,
	schema: ZodRequestSchema,
	middleware?: (
		| Middleware<_PublicHandler>
		| Middleware<_PublicHandler>[]
		| Middleware<_PrivateHandler>
		| Middleware<_PrivateHandler>[]
	),
	handler: _PublicHandler | _PrivateHandler,
}

export interface PublicRoute extends BaseRoute {
	isPrivate?: false,
	middleware?: Middleware<_PublicHandler> | Middleware<_PublicHandler>[],
	handler: _PublicHandler,
}

export interface PrivateRoute extends BaseRoute {
	isPrivate: true,
	middleware?: Middleware<_PrivateHandler> | Middleware<_PrivateHandler>[],
	handler: _PrivateHandler,
}

export type Route = PublicRoute | PrivateRoute;