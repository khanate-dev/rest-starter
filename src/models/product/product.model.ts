import { Schema, model, Types } from 'mongoose';

import { ModelObject, WithMongoId } from '~/types';

export interface Product extends ModelObject {
	user: Types.ObjectId,
	title: string,
	description: string,
	price: number,
	image: string,
}

export type ProductWithId = WithMongoId<Product>;

const productSchema = new Schema<ProductWithId>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const ProductModel = model('Product', productSchema);