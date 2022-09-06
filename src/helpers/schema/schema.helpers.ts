import { Types } from 'mongoose';
import z from 'zod';

import {
	ZodRouteSchema as ZodRouteSchema,
	RouteSchemaInput,
	ZodRouteObject,
	ZodRouteObjectOrArray,
} from '~/types';

export const timestampSchema = z.strictObject({
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const mongoMetaSchema = z.strictObject({
	_id: z.instanceof(Types.ObjectId),
	__v: z.number().min(0),
});

export const getModelSchema = <Key extends string, Schema extends Record<Key, z.ZodTypeAny>>(
	schema: Schema
) => {

	const sansMetaModelSchema = z.strictObject(schema);

	const modelSchema = z.strictObject({
		...mongoMetaSchema.shape,
		...schema,
		...timestampSchema.shape,
	});

	return {
		sansMetaModelSchema,
		modelSchema,
	};

};

const defaultObject = z.strictObject({});
type DefaultObject = typeof defaultObject;

export const createRouteSchema = <
	Body extends ZodRouteObjectOrArray = DefaultObject,
	Params extends ZodRouteObject = DefaultObject,
	Query extends ZodRouteObject = DefaultObject,
	Response extends ZodRouteObjectOrArray = DefaultObject,
>(
	{
		body = defaultObject as Body,
		query = defaultObject as Query,
		params = defaultObject as Params,
		response = defaultObject as Response,
	}: RouteSchemaInput<Body, Params, Query, Response>
): ZodRouteSchema<Body, Params, Query, Response> => {
	return z.strictObject({
		body,
		params,
		query,
		response,
	});
};
