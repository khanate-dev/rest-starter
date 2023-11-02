type _repeatString<
	S extends string,
	N extends number,
	T extends 1[] = [],
> = T['length'] extends N ? '' : `${S}${_repeatString<S, N, [...T, 1]>}`;

type _tuple<N extends number, T, R extends readonly T[]> = R['length'] extends N
	? R
	: _tuple<N, T, [T, ...R]>;

export declare namespace Utils {
	/** type helper to prettify complex object types */
	type prettify<T> = {
		[K in keyof T]: T[K];
	} & {};

	/** checks if the two given types are the same */
	type equal<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U
		? 1
		: 2
		? true
		: false;

	/** makes sure the wrapped type does not take part in inference in a generic function */
	type noInfer<T> = [T][T extends T ? 0 : never];

	type dropFirst<T extends readonly unknown[]> = number extends T['length']
		? T
		: T extends readonly [unknown, ...infer U]
		? U
		: [];

	/** global type helper to repeat a type `N` times in a tuple */
	type tuple<N extends number, T = 1> = N extends N
		? number extends N
			? T[]
			: _tuple<N, T, []>
		: never;

	/** global type helper to repeat a string `N` times in a string literal type */
	type repeatString<S extends string, N extends number> = S extends S
		? _repeatString<S, N>
		: never;

	/** global type helper to create a union array type from a union type */
	type distributedArray<T> = T extends infer I ? I[] : never;

	/** global type helper to be able to use arrow functions for assertions */
	type assertFunction<Type> = (value: unknown) => asserts value is Type;

	/** return only the keys of the object whose value is assignable to the given type */
	type keysOfType<T, Match> = {
		[k in keyof T]: T[k] extends Match ? k : never;
	}[keyof T];

	/** Return a union of keys from all objects in the union */
	type allUnionKeys<T> = T extends infer U ? keyof U : never;

	/** returns a uniformed union of objects by adding missing keys in each union */
	type includeUnionKeys<T extends Record<string, unknown>, U = T> = U extends U
		? prettify<
				{
					[K in keyof U]: U[K];
				} & { [k in Exclude<allUnionKeys<T>, keyof U>]?: never }
		  >
		: never;

	/** Disallow explicitly undefined value for object keys. Used when generic param is constrained to `Partial<ObjType>` */
	type noUndefinedKeys<T extends Obj> = {
		[k in keyof T]: T[k] extends undefined ? never : T[k];
	};

	/** matches a type to another exactly. Used with generic functions to make sure the object type matches exactly */
	type strictly<T, Shape> = Shape & {
		[k in keyof T]: k extends keyof Shape ? Shape[k] : never;
	};

	/** creates a union of the given object or an object where all the keys of the object are undefined */
	type allOrNone<T extends Obj> = T | { [k in keyof T]?: never };

	/** make keys that can be undefined optional in the object */
	type makeUndefinedOptional<T extends Obj> = prettify<
		{
			[k in keyof T as undefined extends T[k] ? k : never]?: T[k];
		} & {
			[k in keyof T as undefined extends T[k] ? never : k]: T[k];
		}
	>;

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

	/** takes a string literal as input and returns the union of all the characters */
	type stringToUnion<T extends string> = T extends `${infer U}${infer V}`
		? U | stringToUnion<V>
		: never;

	/** takes a union of types and converts it into intersection of the types */
	type unionToIntersection<T> = (
		T extends unknown ? (x: T) => unknown : never
	) extends (x: infer U) => unknown
		? U
		: never;

	/** merge two objects together. the second object has priority */
	type deepMerge<T extends Obj, U extends Obj> = prettify<{
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

	/** convert a given union to a union of permutation of tuples */
	type unionToTuples<T, U = T> = [T] extends [never]
		? []
		: U extends U
		? [U, ...unionToTuples<Exclude<T, U>>]
		: [];
}
