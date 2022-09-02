import jwt from 'jsonwebtoken';

import config from '~/config';

import { assertJwt } from '~/helpers/type';

import { Jwt } from '~/types';

const {
	publicKey,
	privateKey,
} = config;

export const signJwt = (
	object: Jwt,
	options?: jwt.SignOptions
) => {
	return jwt.sign(object, privateKey, {
		...options,
		algorithm: 'RS256',
	});
};

interface VerifyJwtResponse {
	valid: boolean,
	expired: boolean,
	decoded?: Jwt,
}

interface VerifyJwtSuccess extends VerifyJwtResponse {
	valid: true,
	expired: false,
	decoded: Jwt,
}
interface VerifyJwtError extends VerifyJwtResponse {
	valid: false,
	expired: boolean,
	decoded?: undefined,
}

export const verifyJwt = (
	token: string
): VerifyJwtSuccess | VerifyJwtError => {
	try {
		const decoded = jwt.verify(token, publicKey);
		assertJwt(decoded);
		return {
			valid: true,
			expired: false,
			decoded,
		};
	}
	catch (error: any) {
		return {
			valid: false,
			expired: error.message === 'jwt expired',
		};
	}
};