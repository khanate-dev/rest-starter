import { RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { Types } from 'mongoose';

import { UserWithoutPassword } from '~/models/user';

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


export type ProtectedHandler<
	Params = ParamsDictionary,
	ResponseBody = any,
	RequestBody = any,
	RequestQuery = Query,
	Locals extends Record<string, any> = Record<string, any>
	> = RequestHandler<
		Params,
		ResponseBody,
		RequestBody,
		RequestQuery,
		{ user: Jwt, } & Locals
	>;