import crypto from 'crypto';

import { CONFIG } from '~/config';

const HASH_LENGTH = 64;

export const getHash = (password: string, salt: string): string => {
	const { iterations, pepper } = CONFIG.hashing;
	const hmac = crypto
		.pbkdf2Sync(password, pepper, iterations, HASH_LENGTH, 'sha512')
		.toString('hex');
	const hash = crypto
		.pbkdf2Sync(hmac, salt, iterations, HASH_LENGTH, 'sha512')
		.toString('hex');
	return hash;
};

/** get a cryptographically strong hex string of given length */
export const getRandomString = (length: number): string =>
	crypto.randomBytes(length / 2).toString('hex');

export const getHashedPassword = (password: string): string => {
	const salt = getRandomString(HASH_LENGTH);
	const hash = getHash(password, salt);
	return `${hash} ${salt}`;
};

export const comparePassword = (candidate: string, password: string) => {
	const [hash, salt] = password.split(' ');
	return salt && hash === getHash(candidate, salt);
};
