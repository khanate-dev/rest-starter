import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

export const echoSchema = createRouteSchema({
	response: z.strictObject({
		success: z.literal(true),
		message: z.literal('The server can be reached'),
	}),
});

export type EchoSchema = z.infer<typeof echoSchema>;