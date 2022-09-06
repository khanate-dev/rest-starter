import {
	createProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema,
	getProductsSchema,
} from '~/schemas/product';


import {
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	updateProductHandler,
	getProductsHandler,
} from '~/controllers/product';

import { Route } from '~/types';

const productRoutes: Route[] = [
	{
		method: 'post',
		path: 'products',
		schema: createProductSchema,
		handler: createProductHandler,
		isPrivate: true,
	},
	{
		method: 'get',
		path: 'products',
		schema: getProductsSchema,
		handler: getProductsHandler,
		isPrivate: true,
	},
	{
		method: 'get',
		path: 'products/:_id',
		schema: getProductSchema,
		handler: getProductHandler,
		isPrivate: true,
	},
	{
		method: 'put',
		path: 'products/:_id',
		schema: updateProductSchema,
		handler: updateProductHandler,
		isPrivate: true,
	},
	{
		method: 'delete',
		path: 'products/:_id',
		schema: deleteProductSchema,
		handler: deleteProductHandler,
		isPrivate: true,
	},
];

export default productRoutes;