import '@total-typescript/ts-reset';

type IRepeatedTuple<
	T,
	N extends number,
	R extends unknown[],
> = R['length'] extends N ? R : IRepeatedTuple<T, N, [T, ...R]>;

type DropFirst<T extends readonly unknown[]> = T extends readonly [
	any?,
	...infer U,
]
	? U
	: [...T];

type IRepeatedString<
	S extends string,
	T extends unknown[],
> = T['length'] extends 1 ? S : `${S}${IRepeatedString<S, DropFirst<T>>}`;

type IRepeatedTuple<
	T,
	N extends number,
	R extends unknown[],
> = R['length'] extends N ? R : IRepeatedTuple<T, N, [T, ...R]>;

declare global {
	type ReadableTypeOf =
		| 'array'
		| 'bigint'
		| 'boolean'
		| 'function'
		| 'null'
		| 'number'
		| 'object'
		| 'string'
		| 'symbol'
		| 'undefined';

	type RepeatedTuple<T, N extends number> = N extends N
		? number extends N
			? T[]
			: IRepeatedTuple<T, N, []>
		: never;

	type DistributedArray<T> = T extends infer I ? I[] : never;

	type RepeatedString<S extends string, N extends number> = IRepeatedString<
		S,
		RepeatedTuple<unknown, N>
	>;

	type AssertFunction<Type> = (value: unknown) => asserts value is Type;

	type AssertArrayFunction<Type> = (
		value: unknown,
		onlyCheckFirst?: boolean,
	) => asserts value is Type;
}
