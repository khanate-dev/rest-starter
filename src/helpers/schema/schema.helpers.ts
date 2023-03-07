import { z } from 'zod';

import type {
	ZodRouteSchema,
	RouteSchemaInput,
	ZodRouteParams,
	ZodRouteResponse,
	ZodRouteQuery,
	ZodRouteBody,
} from '~/types';

export const MONGO_ID_SCHEMA = z.string();

export const MONGO_META_SCHEMA = z.strictObject({
	createdAt: z.date(),
	id: MONGO_ID_SCHEMA,
	updatedAt: z.date(),
});

export const createModelSchema = <
	Key extends string,
	Schema extends Record<Key, z.ZodTypeAny>
>(
	schema: Schema
) => {
	const sansMetaModelSchema = z.strictObject(schema);

	const modelSchema = z.strictObject({
		...MONGO_META_SCHEMA.shape,
		...schema,
	});

	return [sansMetaModelSchema, modelSchema] as const;
};

const DEFAULT_OBJECT = z.strictObject({});
type DefaultObject = typeof DEFAULT_OBJECT;

const DEFAULT_RESPONSE = z.void();
type DefaultResponse = typeof DEFAULT_RESPONSE;

export const createRouteSchema = <
	Body extends ZodRouteBody = DefaultObject,
	Params extends ZodRouteParams = DefaultObject,
	Query extends ZodRouteQuery = DefaultObject,
	Response extends ZodRouteResponse = DefaultResponse
>({
	body = DEFAULT_OBJECT as Body,
	query = DEFAULT_OBJECT as Query,
	params = DEFAULT_OBJECT as Params,
	response = DEFAULT_RESPONSE as Response,
}: RouteSchemaInput<Body, Params, Query, Response>): ZodRouteSchema<
	Body,
	Params,
	Query,
	Response
> => {
	return z.strictObject({
		body,
		params,
		query,
		response,
	});
};
