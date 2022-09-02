import { Request, Response, NextFunction } from 'express';
import z from 'zod';

import { UserSansPassword } from '~/models/user';

import { Status } from '~/types/http';

export interface EnvironmentConfig {
	PORT?: string,
	DB_URI?: string,
	HASHING_ITERATIONS?: string,
	HASHING_PEPPER?: string,
	ACCESS_TOKEN_AGE?: string,
	REFRESH_TOKEN_AGE?: string,
	PUBLIC_KEY?: string,
	PRIVATE_KEY?: string,
}

export interface Config {
	port: number,
	dbUri: string,
	hashing: {
		iterations: number,
		pepper: string,
	},
	accessTokenAge: string,
	refreshTokenAge: string,
	publicKey: string,
	privateKey: string,
}

export type ReadableTypeOf = (
	| 'undefined'
	| 'boolean'
	| 'number'
	| 'bigint'
	| 'string'
	| 'symbol'
	| 'function'
	| 'array'
	| 'null'
	| 'object'
);

export interface Jwt extends Omit<UserSansPassword, '_id'> {
	_id: string,
	session: string,
}

export type AssertFunction<Type> = (value: any) => asserts value is Type;

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
	Body extends ZodRequestObjectOrArray,
	Params extends ZodRequestObject,
	Query extends ZodRequestObject,
	Response extends ZodRequestObjectOrArray,
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

export type ZodRequestSchema<
	Body extends ZodRequestObjectOrArray = ZodRequestObjectOrArray,
	Params extends ZodRequestObject = ZodRequestObject,
	Query extends ZodRequestObject = ZodRequestObject,
	Response extends ZodRequestObjectOrArray = ZodRequestObjectOrArray,
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


type _PublicHandler = PublicHandler<any>;
type _PrivateHandler = PrivateHandler<any>;

export interface PublicRoute {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	schema: ZodRequestSchema,
	middleware?: _PublicHandler | _PublicHandler[],
	handler: _PublicHandler,
}

export interface PrivateRoute {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	schema: ZodRequestSchema,
	middleware?: _PrivateHandler | _PrivateHandler[],
	handler: _PrivateHandler,
}