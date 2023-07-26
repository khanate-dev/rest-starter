type _repeatString<
	S extends string,
	T extends unknown[],
> = T['length'] extends 1 ? S : `${S}${_repeatString<S, Utils.dropFirst<T>>}`;

type _tuple<N extends number, T, R extends readonly T[]> = R['length'] extends N
	? R
	: _tuple<N, T, [T, ...R]>;

export declare namespace Utils {
	type dropFirst<T extends readonly unknown[]> = T extends readonly [
		any?,
		...infer U,
	]
		? U
		: [...T];

	/** global type helper to repeat a type `N` times in a tuple */
	type tuple<N extends number, T = 1> = N extends N
		? number extends N
			? T[]
			: _tuple<N, T, []>
		: never;

	/** global type helper to repeat a string `N` times in a string literal type */
	type repeatString<S extends string, N extends number> = _repeatString<
		S,
		tuple<N, unknown>
	>;

	type filteredKeys<T, U> = {
		[P in keyof T]: T[P] extends U ? P : never;
	}[keyof T];

	/** global type helper to create a union array type from a union type */
	type distributedArray<T> = T extends infer I ? I[] : never;

	/** global type helper to be able to use arrow functions for assertions */
	type assertFunction<Type> = (value: unknown) => asserts value is Type;

	/** global type helper to prettify complex object types */
	type prettify<T> = {
		[K in keyof T]: T[K];
	} & {};

	/** takes a string literal as input and returns the union of all the characters */
	type stringToUnion<T extends string> = T extends `${infer U}${infer V}`
		? U | stringToUnion<V>
		: never;

	/** checks if the two given types are the same */
	type equal<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U
		? 1
		: 2
		? true
		: false;

	/** takes a union of types and converts it into intersection of the types */
	type unionToIntersection<T> = (
		T extends any ? (x: T) => any : never
	) extends (x: infer U) => any
		? U
		: never;

	/** merge two objects together. the second object has priority */
	type deepMerge<T extends Obj, U extends Obj> = Utils.prettify<{
		[k in keyof T | keyof U]: k extends keyof U
			? k extends keyof T
				? T[k] extends Obj
					? U[k] extends Obj
						? deepMerge<T[k], U[k]>
						: U[k]
					: U[k]
				: U[k]
			: k extends keyof T
			? T[k]
			: never;
	}>;

	/** creates a union of the given object or an object where all the keys of the object are undefined */
	type allOrNone<T extends Obj> = T | { [k in keyof T]?: never };

	/** make keys that can be undefined optional in the object */
	type makeUndefinedOptional<T extends Obj> = Utils.prettify<
		{
			[k in keyof T as undefined extends T[k] ? k : never]?: T[k];
		} & {
			[k in keyof T as undefined extends T[k] ? never : k]: T[k];
		}
	>;

	/** convert a given union to a union of permutation of tuples */
	type unionToTuples<T, U = T> = [T] extends [never]
		? []
		: U extends U
		? [U, ...unionToTuples<Exclude<T, U>>]
		: [];

	/** get the last element of a union */
	type lastInUnion<T> = Utils.unionToIntersection<
		T extends unknown ? (x: T) => 0 : never
	> extends (x: infer U) => 0
		? U
		: never;

	/** convert a given union to a tuple of all the elements. order not guaranteed */
	type unionToTuple<T, U = Utils.lastInUnion<T>> = [U] extends [never]
		? []
		: [...unionToTuple<Exclude<T, U>>, U];

	type allUnionKeys<T> = T extends infer U ? keyof U : never;

	/** returns a uniformed union of objects by adding missing keys in each union */
	type includeUnionKeys<T extends Record<string, unknown>, U = T> = U extends U
		? Utils.prettify<
				{
					[K in keyof U]: U[K];
				} & { [k in Exclude<allUnionKeys<T>, keyof U>]?: never }
		  >
		: never;

	/** matches a type to another exactly. Used with generic functions to make sure the object type matches exactly */
	type strictly<T, Shape> = Shape & {
		[k in keyof T]: k extends keyof Shape ? Shape[k] : never;
	};

	/** remove index signatures from an object type */
	type removeIndexSignature<T extends Obj> = {
		[k in keyof T as string extends k
			? never
			: number extends k
			? never
			: symbol extends k
			? never
			: k]: T[k];
	};
}
