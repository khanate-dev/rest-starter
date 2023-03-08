import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { z } from 'zod';
import type { UserRole } from '~/schemas/user';
import type { Jwt } from '~/helpers/auth';
import type { Status } from '~/helpers/http';

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

export interface RouteSchemaInput<
	Body extends ZodRouteBody,
	Params extends ZodRouteParams,
	Query extends ZodRouteQuery,
	Response extends ZodRouteResponse
> {
	body?: Body;
	params?: Params;
	query?: Query;
	response?: Response;
}

export interface ErrorResponse {
	type: string;
	message: string;
}

export type ZodRouteSchema<
	Body extends ZodRouteBody = ZodRouteBody,
	Params extends ZodRouteParams = ZodRouteParams,
	Query extends ZodRouteQuery = ZodRouteQuery,
	Response extends ZodRouteResponse = ZodRouteResponse
> = z.ZodObject<
	{
		body: Body;
		params: Params;
		query: Query;
		response: Response;
	},
	'strict'
>;

type RouteSchema = z.infer<ZodRouteSchema>;

export interface DefaultRouteSchema {
	body: Record<never, never>;
	params: Record<never, never>;
	query: Record<never, never>;
	response: undefined;
}

type UnAuthenticatedLocals = Record<never, never>;
type AuthenticatedLocals = Record<'user', Jwt>;

export interface DetailedResponse<Json extends RouteSchema['response']> {
	status: Status;
	json: Json;
}

export type CustomHandler<
	Locals extends AuthenticatedLocals | UnAuthenticatedLocals,
	Schema extends RouteSchema
> = (
	request: Request<
		Schema['params'],
		Schema['response'],
		Schema['body'],
		Schema['query'],
		Locals
	>,
	response: Response<Schema['response'], Locals>,
	next: NextFunction
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export type _UnAuthenticatedHandler = UnAuthenticatedHandler<any>;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type _AuthenticatedHandler = AuthenticatedHandler<any>;

export const ROUTE_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

export type RouteMethod = (typeof ROUTE_METHODS)[number];

interface BaseRoute {
	method: RouteMethod;
	path: string;
	schema: ZodRouteSchema;
	middleware?: Middleware | Middleware[];
	handler: _AuthenticatedHandler | _UnAuthenticatedHandler;
	isAuthenticated?: boolean;
	availableTo?: UserRole | UserRole[];
}

export interface UnAuthenticatedRoute extends BaseRoute {
	handler: _UnAuthenticatedHandler;
	isAuthenticated?: undefined;
	availableTo?: undefined;
}

export interface AuthenticatedRoute extends BaseRoute {
	handler: _AuthenticatedHandler;
	isAuthenticated: true;
	availableTo?: UserRole | UserRole[];
}

export type Route = AuthenticatedRoute | UnAuthenticatedRoute;
