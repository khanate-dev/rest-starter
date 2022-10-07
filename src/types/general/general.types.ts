import { UserSansPassword } from '~/models/user';

export interface Config {
	env: 'development' | 'production' | 'test',
	port: number,
	dbUri: string,
	hashing: {
		iterations: number,
		pepper: string,
	},
	accessTokenAge: string,
	refreshTokenAge: string,
	publicKey: string,
	privateKey: string,
}

export type ReadableTypeOf = (
	| 'undefined'
	| 'boolean'
	| 'number'
	| 'bigint'
	| 'string'
	| 'symbol'
	| 'function'
	| 'array'
	| 'null'
	| 'object'
);

export interface Jwt extends Omit<UserSansPassword, '_id'> {
	_id: string,
	session: string,
}

export type AssertFunction<Type> = (value: any) => asserts value is Type;
