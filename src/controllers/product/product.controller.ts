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

import { PrivateHandler, Status } from '~/types';

export const createProductHandler: PrivateHandler<CreateProductSchema> = async (
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

export const getProductsHandler: PrivateHandler<GetProductsSchema> = async (
	_request,
	response
) => {

	console.log('reached');
	const userId = response.locals.user._id;
	const products = await findProducts({
		user: userId,
	});

	if (!products) throw new ApiError(Status.NOT_FOUND);
	console.log(products);
	return products;

};

export const getProductHandler: PrivateHandler<GetProductSchema> = async (
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

export const updateProductHandler: PrivateHandler<UpdateProductSchema> = async (
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

export const deleteProductHandler: PrivateHandler<DeleteProductSchema> = async (
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