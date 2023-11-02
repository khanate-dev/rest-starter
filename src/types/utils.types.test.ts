import type { Utils } from './utils.types.js';

type trueTuple<T extends true[]> = T[number] extends true ? true : false;
type falseTuple<T extends false[]> = T[number] extends false ? true : false;

test('test equal type util', () => {
	type trueTests = trueTuple<
		[
			Utils.equal<1, 1>,
			Utils.equal<1 | 2 | 3, 1 | 2 | 3>,
			Utils.equal<[1, 2, 3], [1, 2, 3]>,
			Utils.equal<Utils.prettify<{ x: 1 } & { y: 2 }>, { x: 1; y: 2 }>,
		]
	>;
	type falseTests = falseTuple<
		[
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Utils.equal<any, unknown>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Utils.equal<any, 1>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Utils.equal<any, never>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Utils.equal<any, {}>,
			Utils.equal<unknown, never>,
			Utils.equal<unknown, {}>,
			Utils.equal<1, 1 | 2 | 3>,
			Utils.equal<[1], [1 | 2 | 3]>,
			Utils.equal<{ foo: 1 }, { foo: 2 }>,
			Utils.equal<{ x: 1 } & { y: 2 }, { x: 1; y: 2 }>,
		]
	>;
	assertType<[trueTests, falseTests]>([true, true]);
});

test('test dropFirst type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.dropFirst<[1, 2, 3]>, [2, 3]>,
			Utils.equal<Utils.dropFirst<[]>, []>,
			Utils.equal<Utils.dropFirst<readonly string[]>, readonly string[]>,
		]
	>;
	assertType<tests>(true);
});

test('test tuple type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.tuple<5>, [1, 1, 1, 1, 1]>,
			Utils.equal<Utils.tuple<1, 1 | 2>, [1 | 2]>,
			Utils.equal<Utils.tuple<0, string>, []>,
			Utils.equal<Utils.tuple<1, string | { foo: 1 }>, [string | { foo: 1 }]>,
		]
	>;
	assertType<tests>(true);
});

test('test repeatString type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.repeatString<'1', 5>, '11111'>,
			Utils.equal<Utils.repeatString<'', 5>, ''>,
			Utils.equal<Utils.repeatString<'', 0>, ''>,
			Utils.equal<Utils.repeatString<'foo' | 'bar', 2>, 'foofoo' | 'barbar'>, // cSpell: disable-line,
		]
	>;
	assertType<tests>(true);
});

test('test keysOfType type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.keysOfType<{ foo: 1; bar: 2 }, 1 | 2>, 'foo' | 'bar'>,
			Utils.equal<Utils.keysOfType<{ foo: 1; bar: 2 }, 3>, never>,
			Utils.equal<
				Utils.keysOfType<
					{ foo: { baz: number }; bar: { baz: number | string } },
					{ baz: number }
				>,
				'foo'
			>,
		]
	>;
	assertType<tests>(true);
});

test('test distributedArray type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.distributedArray<1 | 2 | 3>, 1[] | 2[] | 3[]>,
			Utils.equal<Utils.distributedArray<{ foo: 1 | 2 }>, { foo: 1 | 2 }[]>,
		]
	>;
	assertType<tests>(true);
});

test('test prettify type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<
				Utils.prettify<{ x: 1 } & { y: { a: 2 } | { b: 2 } }>,
				{ x: 1; y: { a: 2 } | { b: 2 } }
			>,
		]
	>;
	assertType<tests>(true);
});

test('test stringToUnion type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.stringToUnion<'1'>, '1'>,
			Utils.equal<Utils.stringToUnion<'hello'>, 'h' | 'e' | 'l' | 'o'>,
			Utils.equal<
				Utils.stringToUnion<'coronavirus'>,
				'c' | 'o' | 'r' | 'n' | 'a' | 'v' | 'i' | 'u' | 's'
			>,
		]
	>;
	assertType<tests>(true);
});

test('test unionToIntersection type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<
				Utils.unionToIntersection<'foo' | 42 | true>,
				'foo' & 42 & true
			>,
			Utils.equal<
				Utils.unionToIntersection<(() => 'foo') | ((i: 42) => true)>,
				(() => 'foo') & ((i: 42) => true)
			>,
		]
	>;
	assertType<tests>(true);
});

test('test deepMerge type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<
				Utils.deepMerge<
					{ a: { b: 1; c: 2 }; c: 2 },
					{ a: { b: 11; d: 33 }; c: 1 }
				>,
				{ a: { b: 11; c: 2; d: 33 }; c: 1 }
			>,
		]
	>;
	assertType<tests>(true);
});

test('test makeUndefinedOptional type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.makeUndefinedOptional<{ x: 1 }>, { x: 1 }>,
			Utils.equal<
				Utils.makeUndefinedOptional<{ x: 1; y: undefined; z?: 1 }>,
				{ x: 1; y?: undefined; z?: 1 }
			>,
		]
	>;
	assertType<tests>(true);
});

test('test unionToTuples type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.unionToTuples<never>, []>,
			Utils.equal<
				Utils.unionToTuples<1 | 2 | 3>,
				[1, 2, 3] | [1, 3, 2] | [2, 1, 3] | [2, 3, 1] | [3, 1, 2] | [3, 2, 1]
			>,
		]
	>;
	assertType<tests>(true);
});

test('test allUnionKeys type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<Utils.allUnionKeys<{ x: 1 } | { y: 2 }>, 'x' | 'y'>,
			Utils.equal<Utils.allUnionKeys<{ x: 1 }>, 'x'>,
			Utils.equal<Utils.allUnionKeys<never>, never>,
		]
	>;
	assertType<tests>(true);
});

test('test includeUnionKeys type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<
				Utils.includeUnionKeys<{ x: 1 } | { y: 2 }>,
				{ x: 1; y?: never } | { y: 2; x?: never }
			>,
			Utils.equal<Utils.includeUnionKeys<{ x: 1 }>, { x: 1 }>,
		]
	>;
	assertType<tests>(true);
});

test('test removeIndexSignature type util', () => {
	type tests = trueTuple<
		[
			Utils.equal<
				Utils.removeIndexSignature<{ x: 1; [x: PropertyKey]: number }>,
				{ x: 1 }
			>,
			Utils.equal<Utils.removeIndexSignature<{ x: 1 }>, { x: 1 }>,
		]
	>;
	assertType<tests>(true);
});
