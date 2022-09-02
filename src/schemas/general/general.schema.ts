import z from 'zod';

import { requestSchema } from '~/helpers/type';

export const echoSchema = requestSchema({
	response: z.strictObject({
		success: z.literal(true),
		message: z.literal('The server can be reached'),
	}),
});

export type EchoSchema = z.infer<typeof echoSchema>;