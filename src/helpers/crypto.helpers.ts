import crypto from 'crypto';

import { config } from '~/config.js';

const hashLength = 64;

export const getHash = (password: string, salt: string) => {
	const { iterations, pepper } = config.hashing;
	const hmac = crypto
		.pbkdf2Sync(password, pepper, iterations, hashLength, 'sha512')
		.toString('hex');
	const hash = crypto
		.pbkdf2Sync(hmac, salt, iterations, hashLength, 'sha512')
		.toString('hex');
	return hash;
};

export const getRandomString = (length: number) => {
	return crypto.randomBytes(length / 2).toString('hex');
};

export const getHashedPassword = (password: string) => {
	const salt = getRandomString(hashLength);
	const hash = getHash(password, salt);
	return `${hash} ${salt}`;
};

export const comparePassword = (candidate: string, password: string) => {
	const [hash, salt] = password.split(' ');
	return salt && hash === getHash(candidate, salt);
};
