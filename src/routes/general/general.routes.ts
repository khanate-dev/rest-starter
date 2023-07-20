import { z } from 'zod';

import { createContract, createRoutes } from '~/helpers/route';

export const generalContract = createContract({
	echo: {
		method: 'get',
		auth: true,
		path: '/echo',
		params: { first: 'number' },
		response: z.strictObject({ message: z.string(), success: z.boolean() }),
	},
});

export const generalRoutes = createRoutes(generalContract, {
	echo: async () => {
		return Promise.resolve({
			message: 'Hello World',
			success: true,
		});
	},
});
