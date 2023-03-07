import crypto from 'crypto';

import { CONFIG } from '~/config';

const { iterations, pepper } = CONFIG.hashing;

export const getHash = (password: string, salt: string): string => {
	const hmac = crypto
		.pbkdf2Sync(password, pepper, iterations, 64, 'sha512')
		.toString('hex');

	const hash = crypto
		.pbkdf2Sync(hmac, salt, iterations, 64, 'sha512')
		.toString('hex');

	return hash;
};

export const getRandomString = (length: number): string =>
	crypto.randomBytes(length / 2).toString('hex');

export const getHashedPassword = (password: string): string => {
	const salt = getRandomString(64);
	const hash = getHash(password, salt);
	return `${hash} ${salt}`;
};

export const comparePassword = (candidate: string, password: string) => {
	const [hash, salt] = password.split(' ');
	return salt && hash === getHash(candidate, salt);
};
