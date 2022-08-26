import { ApiError } from '~/errors';
import { getErrorResponseAndCode } from '~/helpers/error';

import { ProductWithId } from '~/models';

import {
	CreateProductInput,
	GetProductInput,
	UpdateProductInput,
} from '~/schemas/product';

import {
	createProduct,
	deleteProduct,
	findAndUpdateProduct,
	findProduct,
} from '~/services/product';

import { ProtectedHandler } from '~/types';

export const createProductHandler: ProtectedHandler<
	CreateProductInput,
	ProductWithId
> = async (request, response) => {
	try {
		const post = await createProduct({
			...request.body,
			user: response.locals.user._id,
		});
		return response.json(post);
	}
	catch (error: any) {
		const { status, json } = getErrorResponseAndCode(error);
		return response.status(status).json(json);
	}
};

export const getProductHandler: ProtectedHandler<
	GetProductInput,
	ProductWithId
> = async (request, response) => {
	try {
		const userId = response.locals.user._id;
		const _id = request.params._id;
		const product = await findProduct({
			user: userId,
			_id,
		});

		if (!product) throw new ApiError(404);

		return response.send(product);
	}
	catch (error: any) {
		const { status, json } = getErrorResponseAndCode(error);
		return response.status(status).json(json);
	}
};

export const updateProductHandler: ProtectedHandler<
	UpdateProductInput,
	ProductWithId | null
> = async (request, response) => {
	try {

		const userId = response.locals.user._id;
		const _id = request.params._id;
		const product = await findProduct({
			user: userId,
			_id,
		});

		if (!product) throw new ApiError(404);
		if (product.user.toJSON() !== userId) throw new ApiError(403);

		const updatedProduct = await findAndUpdateProduct(
			{ _id },
			request.body,
			{ new: true }
		);
		return response.json(updatedProduct);

	}
	catch (error: any) {
		const { status, json } = getErrorResponseAndCode(error);
		return response.status(status).json(json);
	}
};

export const deleteProductHandler: ProtectedHandler<
	GetProductInput,
	ProductWithId | null
> = async (request, response) => {
	try {

		const userId = response.locals.user._id;
		const _id = request.params._id;

		const product = await findProduct({
			user: userId,
			_id,
		});

		if (!product) throw new ApiError(404);
		if (product.user.toJSON() !== userId) throw new ApiError(403);

		const deletedProduct = await deleteProduct({ _id });
		return response.json(deletedProduct);

	}
	catch (error: any) {
		const { status, json } = getErrorResponseAndCode(error);
		return response.status(status).json(json);
	}
};