import { z } from 'zod';

import { createModelSchema, mongoIdSchema } from '~/helpers/schema';

export const [sessionSansMetaSchema, sessionSchema] = createModelSchema({
	userAgent: z.string().nullable(),
	userId: mongoIdSchema,
	valid: z.boolean().nullable(),
});

export type SessionSansMeta = z.infer<typeof sessionSansMetaSchema>;

export type Session = z.infer<typeof sessionSchema>;
