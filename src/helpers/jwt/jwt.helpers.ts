import jwt from 'jsonwebtoken';

import { CONFIG } from '~/config';
import { assertJwt } from '~/helpers/type';

import type { Jwt } from '~/types';

const { publicKey, privateKey } = CONFIG;

export const signJwt = (object: Jwt, options?: jwt.SignOptions) => {
	return jwt.sign(object, privateKey, {
		...options,
		algorithm: 'RS256',
	});
};

interface VerifyJwtResponse {
	valid: boolean;
	expired: boolean;
	decoded?: Jwt;
}

interface VerifyJwtSuccess extends VerifyJwtResponse {
	valid: true;
	expired: false;
	decoded: Jwt;
}
interface VerifyJwtError extends VerifyJwtResponse {
	valid: false;
	expired: boolean;
	decoded?: undefined;
}

export const verifyJwt = (token: string): VerifyJwtError | VerifyJwtSuccess => {
	try {
		const decoded = jwt.verify(token, publicKey);
		assertJwt(decoded);
		return {
			decoded,
			expired: false,
			valid: true,
		};
	} catch (error: any) {
		return {
			expired: error.message === 'jwt expired',
			valid: false,
		};
	}
};
