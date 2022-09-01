import z from 'zod';

import { requestSchema } from '~/helpers/type';

const body = z.strictObject({
	title: z.string({
		required_error: 'title is required',
	}),
	description: z.string({
		required_error: 'description is required',
	}).min(120, 'description should be at least 120 characters long'),
	price: z.number({
		required_error: 'price is required',
	}),
	image: z.string({
		required_error: 'image is required',
	}),
});

const params = z.strictObject({
	_id: z.string({
		required_error: 'product id is required',
	}),
});

export const createProductSchema = requestSchema({
	body,
});

export const updateProductSchema = requestSchema({
	body,
	params,
});

export const getProductSchema = requestSchema({
	params,
});

export const deleteProductSchema = requestSchema({
	params,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductInput = z.infer<typeof getProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;