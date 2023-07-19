import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { z } from 'zod';
import type { Jwt } from '~/helpers/auth';
import type { Status } from '~/helpers/http';
import type { UserRole } from '~/schemas/user';

export type ZodRouteParams =
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodObject<Record<string, any>, 'strict'>;

export type ZodRouteQuery =
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodObject<Record<string, any>, 'strict'>;

export type ZodRouteBody =
	| z.ZodArray<
			| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
			| z.ZodObject<Record<string, any>, 'strict'>
	  >
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodObject<Record<string, any>, 'strict'>;

export type ZodRouteResponse =
	| z.ZodArray<
			| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
			| z.ZodObject<Record<string, any>, 'strict'>
	  >
	| z.ZodEffects<z.ZodObject<Record<string, any>, 'strict'>>
	| z.ZodObject<Record<string, any>, 'strict'>
	| z.ZodVoid;

export type RouteSchemaInput<
	Body extends ZodRouteBody,
	Params extends ZodRouteParams,
	Query extends ZodRouteQuery,
	Res extends ZodRouteResponse,
> = {
	body?: Body;
	params?: Params;
	query?: Query;
	response?: Res;
};

export type ErrorResponse = {
	type: string;
	message: string;
};

export type ZodRouteSchema<
	Body extends ZodRouteBody = ZodRouteBody,
	Params extends ZodRouteParams = ZodRouteParams,
	Query extends ZodRouteQuery = ZodRouteQuery,
	Res extends ZodRouteResponse = ZodRouteResponse,
> = z.ZodObject<
	{
		body: Body;
		params: Params;
		query: Query;
		response: Res;
	},
	'strict'
>;

type RouteSchema = z.infer<ZodRouteSchema>;

export type DefaultRouteSchema = {
	body: Record<never, never>;
	params: Record<never, never>;
	query: Record<never, never>;
	response: undefined;
};

type UnAuthenticatedLocals = Record<never, never>;
type AuthenticatedLocals = Record<'user', Jwt>;

export type DetailedResponse<Json extends RouteSchema['response']> = {
	status: Status;
	json: Json;
};

export type CustomHandler<
	Locals extends AuthenticatedLocals | UnAuthenticatedLocals,
	Schema extends RouteSchema,
> = (
	request: Request<
		Schema['params'],
		Schema['response'],
		Schema['body'],
		Schema['query'],
		Locals
	>,
	response: Response<Schema['response'], Locals>,
	next: NextFunction,
) => Promise<DetailedResponse<Schema['response']> | Schema['response']>;

export type UnAuthenticatedHandler<Schema extends RouteSchema> = CustomHandler<
	UnAuthenticatedLocals,
	Schema
>;
export type AuthenticatedHandler<Schema extends RouteSchema> = CustomHandler<
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

export type _UnAuthenticatedHandler = UnAuthenticatedHandler<any>;

export type _AuthenticatedHandler = AuthenticatedHandler<any>;

export const ROUTE_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

export type RouteMethod = (typeof ROUTE_METHODS)[number];

type BaseRoute = {
	method: RouteMethod;
	path: string;
	schema: ZodRouteSchema;
	middleware?: Middleware | Middleware[];
	handler: _AuthenticatedHandler | _UnAuthenticatedHandler;
	isAuthenticated?: boolean;
	availableTo?: UserRole | UserRole[];
};

export type UnAuthenticatedRoute = {
	handler: _UnAuthenticatedHandler;
	isAuthenticated?: undefined;
	availableTo?: undefined;
} & BaseRoute;

export type AuthenticatedRoute = {
	handler: _AuthenticatedHandler;
	isAuthenticated: true;
	availableTo?: UserRole | UserRole[];
} & BaseRoute;

export type Route = AuthenticatedRoute | UnAuthenticatedRoute;
