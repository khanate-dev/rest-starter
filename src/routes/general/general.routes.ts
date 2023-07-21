import { initContract } from '@ts-rest/core';
import { initServer } from '@ts-rest/express';
import { z } from 'zod';

const c = initContract();
const r = initServer();

export const generalContract = c.router({
	echo: {
		method: 'GET',
		path: '/echo',
		responses: {
			200: z.strictObject({ message: z.string(), success: z.boolean() }),
		},
	},
});

export const generalRouter = r.router(generalContract, {
	echo: async () => {
		return Promise.resolve({
			status: 200,
			body: { message: 'Hello World', success: true },
		});
	},
});
