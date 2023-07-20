import { z } from 'zod';

export const mongoIdSchema = z.string();

export const mongoMetaSchema = z.strictObject({
	createdAt: z.date(),
	id: mongoIdSchema,
	updatedAt: z.date(),
});

export const createModelSchema = <
	Key extends string,
	Schema extends Record<Key, z.ZodTypeAny>,
>(
	schema: Schema,
) => {
	const sansMetaModelSchema = z.strictObject(schema);

	const modelSchema = z.strictObject({
		...mongoMetaSchema.shape,
		...schema,
	});

	return [sansMetaModelSchema, modelSchema] as const;
};
