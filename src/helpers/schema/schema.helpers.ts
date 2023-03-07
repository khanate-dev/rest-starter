import { Types } from 'mongoose';
import z from 'zod';

import type {
	ZodRouteSchema,
	RouteSchemaInput,
	ZodRouteParams,
	ZodRouteResponse,
	ZodRouteQuery,
	ZodRouteBody,
} from '~/types';

export const timestampSchema = z.strictObject({
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const mongoMetaSchema = z.strictObject({
	__v: z.number().min(0),
	_id: z.instanceof(Types.ObjectId),
});

export const getModelSchema = <
	Key extends string,
	Schema extends Record<Key, z.ZodTypeAny>
>(
	schema: Schema
) => {

	const sansMetaModelSchema = z.strictObject(schema);

	const modelSchema = z.strictObject({
		...mongoMetaSchema.shape,
		...schema,
		...timestampSchema.shape,
	});

	return [
		sansMetaModelSchema,
		modelSchema,
	] as const;

};

const defaultObject = z.strictObject({});
type DefaultObject = typeof defaultObject;

const defaultResponse = z.void();
type DefaultResponse = typeof defaultResponse;

export const createRouteSchema = <
	Body extends ZodRouteBody = DefaultObject,
	Params extends ZodRouteParams = DefaultObject,
	Query extends ZodRouteQuery = DefaultObject,
	Response extends ZodRouteResponse = DefaultResponse,
>(
	{
		body = defaultObject as Body,
		query = defaultObject as Query,
		params = defaultObject as Params,
		response = defaultResponse as Response,
	}: RouteSchemaInput<Body, Params, Query, Response>
): ZodRouteSchema<Body, Params, Query, Response> => {
	return z.strictObject({
		body,
		params,
		query,
		response,
	});
};
