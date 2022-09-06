import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

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

export const createProductSchema = createRouteSchema({
	body,
	response,
});

export const updateProductSchema = createRouteSchema({
	body,
	params,
	response,
});

export const getProductsSchema = createRouteSchema({
	response: z.array(response),
});

export const getProductSchema = createRouteSchema({
	params,
	response,
});

export const deleteProductSchema = createRouteSchema({
	params,
	response,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
export type GetProductSchema = z.infer<typeof getProductSchema>;
export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;