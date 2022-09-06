import { Request, Response, NextFunction, RequestHandler } from 'express';
import z from 'zod';

import { Jwt } from '~/types/general';
import { Status } from '~/types/http';

export type ZodRouteObject = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
);

export type ZodRouteObjectOrArray = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodArray<
		z.ZodObject<Record<string, any>, 'strict'>
		| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	>
);

export interface RouteSchemaInput<
	Body extends ZodRouteObjectOrArray,
	Params extends ZodRouteObject,
	Query extends ZodRouteObject,
	Response extends ZodRouteObjectOrArray,
> {
	body?: Body,
	params?: Params,
	query?: Query,
	response?: Response,
}

export type ErrorResponse = {
	type: string,
	message: string,
};

export type ZodRouteSchema<
	Body extends ZodRouteObjectOrArray = ZodRouteObjectOrArray,
	Params extends ZodRouteObject = ZodRouteObject,
	Query extends ZodRouteObject = ZodRouteObject,
	Response extends ZodRouteObjectOrArray = ZodRouteObjectOrArray,
> = z.ZodObject<
	{
		body: Body,
		params: Params,
		query: Query,
		response: Response,
	}
	, 'strict'
>;

interface RouteSchema {
	body: Record<string, any> | Record<string, any>[],
	params: Record<string, any>,
	query: Record<string, any>,
	response: Record<string, any> | Record<string, any>[] | void,
}
export interface DefaultRouteSchema {
	body: Record<never, never>,
	params: Record<never, never>,
	query: Record<never, never>,
	response: void,
}

type PublicLocals = Record<never, never>;
type PrivateLocals = Record<'user', Jwt>;

export interface DetailedResponse<Json extends RouteSchema['response']> {
	status: Status,
	json: Json,
}

export type CustomHandler<
	Locals extends PublicLocals | PrivateLocals,
	Schema extends RouteSchema,
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
) => Promise<Schema['response'] | DetailedResponse<Schema['response']>>;

export type PublicHandler<
	Schema extends RouteSchema
> = CustomHandler<
	PublicLocals,
	Schema
>;
export type PrivateHandler<
	Schema extends RouteSchema,
> = CustomHandler<
	PrivateLocals,
	Schema
>;

export type Middleware = RequestHandler<
	never,
	ErrorResponse,
	never,
	never,
	never
>;

export type PrivateMiddleware = RequestHandler<
	never,
	ErrorResponse,
	never,
	never,
	Partial<PrivateLocals>
>;

export type _PublicHandler = PublicHandler<any>;
export type _PrivateHandler = PrivateHandler<any>;

export type RouteMethod = (
	| 'get'
	| 'post'
	| 'put'
	| 'patch'
	| 'delete'
);

export interface PublicRoute {
	method: RouteMethod,
	path: string,
	schema: ZodRouteSchema,
	middleware?: Middleware | Middleware[],
	handler: _PublicHandler,
}

export interface PrivateRoute {
	method: RouteMethod,
	path: string,
	schema: ZodRouteSchema,
	middleware?: PrivateMiddleware | PrivateMiddleware[],
	handler: _PrivateHandler,
}