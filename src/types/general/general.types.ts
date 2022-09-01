import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ZodEffects, ZodObject, ZodTypeAny } from 'zod';

import { UserWithoutPassword } from '~/models/user';

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

export interface ModelObject {
	createdAt: Date,
	updatedAt: Date,
}

export type WithMongoId<Type extends ModelObject> = Type & {
	_id: Types.ObjectId,
};

export interface JwtInput extends UserWithoutPassword {
	session: Types.ObjectId,
}

export interface Jwt extends Omit<UserWithoutPassword, '_id'> {
	_id: string,
	session: string,
}

export type AssertFunction<Type> = (value: any) => asserts value is Type;

export type EmptyZodObject = ZodObject<
	Record<never, never>,
	'strict',
	ZodTypeAny,
	Record<never, never>,
	Record<never, never>
>;

export type RequestSchemaInputObject = (
	ZodObject<Record<string, any>, 'strict'>
	| ZodEffects<ZodObject<Record<string, any>, 'strict'>>
);

export interface RequestSchemaInput<
	Body extends RequestSchemaInputObject,
	Params extends RequestSchemaInputObject,
	Query extends RequestSchemaInputObject
	> {
	body?: Body,
	params?: Params,
	query?: Query,
}

export type ErrorResponse = {
	type: string,
	message: string,
};

export type RequestSchema<
	Body extends RequestSchemaInputObject = RequestSchemaInputObject,
	Params extends RequestSchemaInputObject = RequestSchemaInputObject,
	Query extends RequestSchemaInputObject = RequestSchemaInputObject
	> = ZodObject<
		{
			body: Body,
			params: Params,
			query: Query,
		}
		, 'strict'
	>;

type RequestType = Record<'params' | 'body' | 'query', Record<string, any>>;
export type DefaultRequest = Record<'params' | 'body' | 'query', Record<never, never>>;

type ResponseBodyType = Record<string, any>;

type PublicLocals = Record<never, never>;
type PrivateLocals = { user: Jwt, };

export interface DetailedResponse<Json extends ResponseBodyType> {
	status: Status,
	json: Json,
}

export type CustomHandler<
	Locals extends PublicLocals | PrivateLocals,
	RequestObject extends RequestType,
	ResponseBody extends ResponseBodyType
	> = (
		request: Request<
			RequestObject['params'],
			ResponseBody,
			RequestObject['body'],
			RequestObject['query'],
			Locals
		>,
		response: Response<
			ResponseBody,
			Locals
		>,
		next: NextFunction
	) => Promise<ResponseBody | DetailedResponse<ResponseBody>>;

export type PublicHandler<
	RequestObject extends RequestType,
	ResponseBody extends ResponseBodyType,
	> = CustomHandler<
		PublicLocals,
		RequestObject,
		ResponseBody
	>;
export type PrivateHandler<
	RequestObject extends RequestType,
	ResponseBody extends ResponseBodyType,
	> = CustomHandler<
		PrivateLocals,
		RequestObject,
		ResponseBody
	>;


type _PublicHandler = PublicHandler<any, ResponseBodyType>;
type _PrivateHandler = PrivateHandler<any, ResponseBodyType>;

export interface PublicRoute {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	schema?: RequestSchema,
	middleware?: _PublicHandler | _PublicHandler[],
	handler: _PublicHandler,
}

export interface PrivateRoute {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	schema?: RequestSchema,
	middleware?: _PrivateHandler | _PrivateHandler[],
	handler: _PrivateHandler,
}