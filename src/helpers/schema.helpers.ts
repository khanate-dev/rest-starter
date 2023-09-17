import { z } from 'zod';

import { regex } from '~/constants.js';

import type { Utils } from '~/types/utils.types.js';

export const portSchema = z.coerce
	.number()
	.int()
	.positive()
	.min(1024)
	.max(65535);

export const dbIdSchema = z.string().regex(regex.mongoId);

export type ZodDbId = typeof dbIdSchema;

export type DbId = z.infer<ZodDbId>;

export const dbMetaSchema = z.strictObject({
	id: dbIdSchema,
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export const createModelSchema = <
	Key extends string,
	Schema extends Record<Key, z.ZodTypeAny>,
>(
	schema: Schema,
) => {
	const sansMetaModelSchema = z.strictObject(schema);

	const modelSchema = z.strictObject({
		...dbMetaSchema.shape,
		...schema,
	});

	return [sansMetaModelSchema, modelSchema] as const;
};

export const zodAllOrNone = <T extends Record<string, z.Schema>>(
	shape: T,
): z.Schema<
	Utils.allOrNone<
		Utils.makeUndefinedOptional<{ [k in keyof T]: T[k]['_output'] }>
	>
> => {
	return z.strictObject(shape).or(
		z.object(
			Object.keys(shape).reduce(
				(acc, key) => {
					acc[key] = z.undefined();
					return acc;
				},
				{} as Record<string, z.ZodUndefined>,
			),
		),
	);
};
