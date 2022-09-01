import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import { ProductModel, ProductSansMeta, Product } from '~/models/product';

export const createProduct = async (
	input: DocumentDefinition<Omit<ProductSansMeta, 'createdAt' | 'updatedAt'>>
) => {
	return ProductModel.create(input);
};

export const findProduct = async (
	query: FilterQuery<Product>,
	options?: QueryOptions
) => {
	return ProductModel.findOne(query, {}, options).lean();
};

export const findAndUpdateProduct = async (
	query: FilterQuery<Product>,
	update: UpdateQuery<ProductSansMeta>,
	options?: QueryOptions
) => {
	return ProductModel.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (
	query: FilterQuery<Product>
) => {
	return ProductModel.findOneAndRemove(query);
};