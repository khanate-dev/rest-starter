import jwt from 'jsonwebtoken';
import config from 'config';

import { assertJwt } from '~/helpers/type';

import { Jwt, JwtInput } from '~/types/general';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

export const signJwt = (
	object: JwtInput,
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