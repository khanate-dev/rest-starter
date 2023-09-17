import { z } from 'zod';

import { createModelSchema, dbIdSchema } from '~/helpers/schema.helpers.js';

export const [sessionSansMetaSchema, sessionSchema] = createModelSchema({
	user_agent: z.string().nullable(),
	user_id: dbIdSchema,
	valid: z.boolean().nullable(),
});

export type SessionSansMeta = z.infer<typeof sessionSansMetaSchema>;

export type Session = z.infer<typeof sessionSchema>;
