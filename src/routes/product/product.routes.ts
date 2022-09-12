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
		path: '/',
		schema: createProductSchema,
		handler: createProductHandler,
		isAuthenticated: true,
	},
	{
		method: 'get',
		path: '/',
		schema: getProductsSchema,
		handler: getProductsHandler,
		isAuthenticated: true,
	},
	{
		method: 'get',
		path: '/:_id',
		schema: getProductSchema,
		handler: getProductHandler,
		isAuthenticated: true,
	},
	{
		method: 'put',
		path: '/:_id',
		schema: updateProductSchema,
		handler: updateProductHandler,
		isAuthenticated: true,
	},
	{
		method: 'delete',
		path: '/:_id',
		schema: deleteProductSchema,
		handler: deleteProductHandler,
		isAuthenticated: true,
	},
];

export default productRoutes;