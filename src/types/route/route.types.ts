import { Request, Response, NextFunction, RequestHandler } from 'express';
import z from 'zod';

import { Jwt } from '~/types/general';
import { Status } from '~/types/http';

export type ZodRouteParams = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
);

export type ZodRouteQuery = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
);

export type ZodRouteBody = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodArray<
		z.ZodObject<Record<string, any>, 'strict'>
		| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	>
);

export type ZodRouteResponse = (
	z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodArray<
		z.ZodObject<Record<string, any>, 'strict'>
		| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	>
	| z.ZodVoid
);

export interface RouteSchemaInput<
	Body extends ZodRouteBody,
	Params extends ZodRouteParams,
	Query extends ZodRouteQuery,
	Response extends ZodRouteResponse,
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
	Body extends ZodRouteBody = ZodRouteBody,
	Params extends ZodRouteParams = ZodRouteParams,
	Query extends ZodRouteQuery = ZodRouteQuery,
	Response extends ZodRouteResponse = ZodRouteResponse,
> = z.ZodObject<
	{
		body: Body,
		params: Params,
		query: Query,
		response: Response,
	}
	, 'strict'
>;

type RouteSchema = z.infer<ZodRouteSchema>;

export interface DefaultRouteSchema {
	body: Record<never, never>,
	params: Record<never, never>,
	query: Record<never, never>,
	response: void,
}

type UnAuthenticatedLocals = Record<never, never>;
type AuthenticatedLocals = Record<'user', Jwt>;

export interface DetailedResponse<Json extends RouteSchema['response']> {
	status: Status,
	json: Json,
}

export type CustomHandler<
	Locals extends UnAuthenticatedLocals | AuthenticatedLocals,
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

export type UnAuthenticatedHandler<
	Schema extends RouteSchema
> = CustomHandler<
	UnAuthenticatedLocals,
	Schema
>;
export type AuthenticatedHandler<
	Schema extends RouteSchema,
> = CustomHandler<
	AuthenticatedLocals,
	Schema
>;

export type Middleware = RequestHandler<
	never,
	ErrorResponse,
	never,
	never,
	never
>;

export type AuthenticatedMiddleware = RequestHandler<
	never,
	ErrorResponse,
	never,
	never,
	Partial<AuthenticatedLocals>
>;

export type _UnauthenticatedHandler = UnAuthenticatedHandler<any>;
export type _AuthenticatedHandler = AuthenticatedHandler<any>;

export const routeMethods = [
	'get',
	'post',
	'put',
	'patch',
	'delete',
] as const;

export type RouteMethod = typeof routeMethods[number];

interface BaseRoute {
	method: RouteMethod,
	path: string,
	schema: ZodRouteSchema,
	middleware?: Middleware | Middleware[],
	handler: _UnauthenticatedHandler | _AuthenticatedHandler,
	isAuthenticated?: boolean,
}

export interface UnauthenticatedRoute extends BaseRoute {
	handler: _UnauthenticatedHandler,
	isAuthenticated?: undefined,
}

export interface AuthenticatedRoute extends BaseRoute {
	handler: _AuthenticatedHandler,
	isAuthenticated: true,
}

export type Route = UnauthenticatedRoute | AuthenticatedRoute;