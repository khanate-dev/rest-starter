import z from 'zod';

import { requestSchema } from '~/helpers/type';

import { productModelSchema } from '~/models';

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

const response = productModelSchema;

export const createProductSchema = requestSchema({
	body,
	response,
});

export const updateProductSchema = requestSchema({
	body,
	params,
	response,
});

export const getProductsSchema = requestSchema({
	response: z.array(response),
});

export const getProductSchema = requestSchema({
	params,
	response,
});

export const deleteProductSchema = requestSchema({
	params,
	response,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
export type GetProductSchema = z.infer<typeof getProductSchema>;
export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;