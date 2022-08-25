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

import { ProtectedHandler } from '~/types/general';

export const createProductHandler: ProtectedHandler<any, any, CreateProductInput['body']> = async (
	request,
	response
) => {
	try {
		const post = await createProduct({
			...request.body,
			user: response.locals.user._id,
		});
		return response.send(post);
	}
	catch (error: any) {
		return response.status(409).send(error.message ?? error);
	}
};

export const updateProductHandler: ProtectedHandler<UpdateProductInput['params'], any, UpdateProductInput['body']> = async (
	request,
	response
) => {
	try {
		const userId = response.locals.user._id;
		const _id = request.params._id;
		const product = await findProduct({
			user: userId,
			_id,
		});
		if (!product) {
			return response.sendStatus(404);
		}
		if (product.user.toJSON() !== userId) {
			return response.sendStatus(403);
		}
		const updatedProduct = await findAndUpdateProduct(
			{ _id },
			request.body,
			{ new: true }
		);
		return response.send(updatedProduct);
	}
	catch (error: any) {
		return response.status(409).send(error.message ?? error);
	}
};

export const getProductHandler: ProtectedHandler<GetProductInput['params']> = async (
	request,
	response
) => {
	try {
		const userId = response.locals.user._id;
		const _id = request.params._id;
		const product = await findProduct({
			user: userId,
			_id,
		});
		if (!product) {
			return response.sendStatus(404);
		}
		return response.send(product);
	}
	catch (error: any) {
		return response.status(409).send(error.message ?? error);
	}
};

export const deleteProductHandler: ProtectedHandler<GetProductInput['params']> = async (
	request,
	response
) => {
	try {
		const userId = response.locals.user._id;
		const _id = request.params._id;
		const product = await findProduct({
			user: userId,
			_id,
		});
		if (!product) {
			return response.sendStatus(404);
		}
		if (product.user.toJSON() !== userId) {
			return response.sendStatus(403);
		}
		const deletedProduct = await deleteProduct({ _id });
		return response.send(deletedProduct);
	}
	catch (error: any) {
		return response.status(409).send(error.message ?? error);
	}
};