import jwt from 'jsonwebtoken';

import { CONFIG } from '~/config';
import { MONGO_ID_SCHEMA } from '~/helpers/schema';
import { USER_SANS_PASSWORD_SCHEMA } from '~/schemas/user';

import type { z } from 'zod';

export const JWT_SCHEMA = USER_SANS_PASSWORD_SCHEMA.extend({
	id: MONGO_ID_SCHEMA,
	sessionId: MONGO_ID_SCHEMA,
});

export type Jwt = z.infer<typeof JWT_SCHEMA>;

export const signJwt = (object: Jwt, options?: jwt.SignOptions) => {
	return jwt.sign(object, CONFIG.privateKey, {
		...options,
		algorithm: 'RS256',
	});
};

export type JwtVerification =
	| { valid: false; expired: boolean }
	| { valid: true; payload: Jwt };

export const verifyJwt = (token: string): JwtVerification => {
	try {
		const payload = JWT_SCHEMA.parse(jwt.verify(token, CONFIG.publicKey));
		return { payload, valid: true };
	} catch (error) {
		return {
			expired: error instanceof Error && error.message === 'jwt expired',
			valid: false,
		};
	}
};
