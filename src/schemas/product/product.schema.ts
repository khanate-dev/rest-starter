import {
	number,
	strictObject,
	string,
	TypeOf,
} from 'zod';

import { requestSchema } from '~/helpers/type';

const body = strictObject({
	title: string({
		required_error: 'title is required',
	}),
	description: string({
		required_error: 'description is required',
	}).min(120, 'description should be at least 120 characters long'),
	price: number({
		required_error: 'price is required',
	}),
	image: string({
		required_error: 'image is required',
	}),
});

const params = strictObject({
	_id: string({
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

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type GetProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;