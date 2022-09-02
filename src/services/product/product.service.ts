import {
	DocumentDefinition,
	FilterQuery,
	QueryOptions,
	UpdateQuery,
} from 'mongoose';

import { ProductModel, ProductSansMeta, Product } from '~/models/product';

export const createProduct = async (
	input: DocumentDefinition<ProductSansMeta>
): Promise<Product> => {
	const product = (await ProductModel.create(input)).toJSON();
	return product;
};

export const findProducts = async (
	query: FilterQuery<Product>,
	options?: QueryOptions
): Promise<null | Product[]> => {
	const products = await ProductModel.find(
		query,
		{},
		options
	).lean();
	return products;
};

export const findProduct = async (
	query: FilterQuery<Product>,
	options?: QueryOptions
): Promise<null | Product> => {
	const product = await ProductModel.findOne(
		query,
		{},
		options
	).lean();
	return product;
};

export const findAndUpdateProduct = async (
	query: FilterQuery<Product>,
	update: UpdateQuery<ProductSansMeta>,
	options?: QueryOptions
): Promise<null | Product> => {
	const updatedProduct = await ProductModel.findOneAndUpdate(
		query,
		update,
		options
	).lean();
	return updatedProduct;
};

export const deleteProduct = async (
	query: FilterQuery<Product>
): Promise<null | Product> => {
	const deletedProduct = await ProductModel.findOneAndRemove(query).lean();
	return deletedProduct;
};