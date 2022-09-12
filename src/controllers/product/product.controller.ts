import { ApiError } from '~/errors';

import {
	CreateProductSchema,
	DeleteProductSchema,
	GetProductSchema,
	GetProductsSchema,
	UpdateProductSchema,
} from '~/schemas/product';

import {
	createProduct,
	deleteProduct,
	findAndUpdateProduct,
	findProduct,
	findProducts,
} from '~/services/product';

import { AuthenticatedHandler, Status } from '~/types';

export const createProductHandler: AuthenticatedHandler<CreateProductSchema> = async (
	request,
	response
) => {
	const product = await createProduct({
		...request.body,
		user: response.locals.user._id,
	});
	return {
		status: Status.CREATED,
		json: product,
	};
};

export const getProductsHandler: AuthenticatedHandler<GetProductsSchema> = async (
	_request,
	response
) => {

	const userId = response.locals.user._id;
	const products = await findProducts({
		user: userId,
	});

	if (!products) throw new ApiError(Status.NOT_FOUND);
	return products;

};

export const getProductHandler: AuthenticatedHandler<GetProductSchema> = async (
	request,
	response
) => {

	const userId = response.locals.user._id;
	const _id = request.params._id;
	const product = await findProduct({
		user: userId,
		_id,
	});

	if (!product) throw new ApiError(Status.NOT_FOUND);

	return product;

};

export const updateProductHandler: AuthenticatedHandler<UpdateProductSchema> = async (
	request,
	response
) => {

	const userId = response.locals.user._id;
	const _id = request.params._id;
	const product = await findProduct({
		user: userId,
		_id,
	});

	if (!product) throw new ApiError(Status.NOT_FOUND);
	if (product.user.toJSON() !== userId) throw new ApiError(Status.FORBIDDEN);

	const updatedProduct = await findAndUpdateProduct(
		{ _id },
		request.body,
		{ new: true }
	);

	if (!updatedProduct) throw new ApiError(Status.NOT_FOUND);

	return updatedProduct;

};

export const deleteProductHandler: AuthenticatedHandler<DeleteProductSchema> = async (
	request,
	response
) => {

	const userId = response.locals.user._id;
	const _id = request.params._id;

	const product = await findProduct({
		user: userId,
		_id,
	});

	if (!product) throw new ApiError(Status.NOT_FOUND);
	if (product.user.toJSON() !== userId) throw new ApiError(Status.FORBIDDEN);

	const deletedProduct = await deleteProduct({ _id });

	if (!deletedProduct) throw new ApiError(Status.NOT_FOUND);

	return deletedProduct;

};