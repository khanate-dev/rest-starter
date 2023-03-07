import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

export const echoSchema = createRouteSchema({
	response: z.strictObject({
		message: z.literal('The server can be reached'),
		success: z.literal(true),
	}),
});

export type EchoSchema = z.infer<typeof echoSchema>;
