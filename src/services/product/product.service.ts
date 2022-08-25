import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import { ProductModel, Product, ProductWithId } from '~/models/product';

export const createProduct = async (
	input: DocumentDefinition<Omit<Product, 'createdAt' | 'updatedAt'>>
) => {
	return ProductModel.create(input);
};

export const findProduct = async (
	query: FilterQuery<ProductWithId>,
	options?: QueryOptions
) => {
	return ProductModel.findOne(query, {}, options).lean();
};

export const findAndUpdateProduct = async (
	query: FilterQuery<ProductWithId>,
	update: UpdateQuery<Product>,
	options?: QueryOptions
) => {
	return ProductModel.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (
	query: FilterQuery<ProductWithId>
) => {
	return ProductModel.deleteOne(query);
};