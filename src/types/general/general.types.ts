import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { AnyZodObject, ZodObject, ZodTypeAny } from 'zod';

import { UserWithoutPassword } from '~/models/user';

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

export interface RequestSchema<
	Body extends AnyZodObject,
	Query extends AnyZodObject,
	Params extends AnyZodObject
	> {
	body?: Body,
	query?: Query,
	params?: Params,
}

export type ErrorResponse = {
	type: string,
	message: string,
	[x: string]: any,
};

type RequestType = Record<'params' | 'body' | 'query', Record<string, any>>;
type DefaultRequest = Record<'params' | 'body' | 'query', Record<never, never>>;
type DefaultResponse = Record<never, never>;
type LocalsType = Record<string, any>;
type DefaultLocals = Record<never, never>;

export type ProtectedHandler<
	Request extends RequestType = DefaultRequest,
	ResponseBody = DefaultResponse,
	Locals extends LocalsType = DefaultLocals
	> = RequestHandler<
		Request['params'],
		ResponseBody | ErrorResponse,
		Request['body'],
		Request['query'],
		{ user: Jwt, } & Locals
	>;