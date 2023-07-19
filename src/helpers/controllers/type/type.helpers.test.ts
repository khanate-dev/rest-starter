/* eslint-disable vitest/no-conditional-in-test */
/* eslint-disable vitest/no-conditional-tests */

import {
	assertArray,
	assertObject,
	isArray,
	isObject,
	readableTypeOf,
} from './type.helpers';

import type { Utils } from '~/types/utils';

const isNumber = (value: any): value is number => typeof value === 'number';

const assertNumber: Utils.assertFunction<number> = (value) => {
	const type = readableTypeOf(value);
	if (type !== 'number') throw new Error(`Expected number, received ${type}`);
};

test('should test readableTypeof helper', () => {
	expect(readableTypeOf(2)).toBe('number');
	expect(readableTypeOf('2')).toBe('string');
	expect(readableTypeOf(BigInt(2))).toBe('bigint');
	expect(readableTypeOf(Symbol(2))).toBe('symbol');
	expect(readableTypeOf(true)).toBe('boolean');
	expect(readableTypeOf(undefined)).toBe('undefined');
	expect(readableTypeOf({})).toBe('object');
	expect(readableTypeOf([2])).toBe('array');
	expect(readableTypeOf(null)).toBe('null');
	expect(readableTypeOf(() => false)).toBe('function');
});

test('should test isObject helper', () => {
	expect(isObject(2)).toBeFalsy();
	expect(isObject({ fist: 'of fury' })).toBeTruthy();
	const a: any = 2;
	isObject(a) && assertType<Obj>(a);
});

test('should test isArray helper', () => {
	expect(isArray(2)).toBeFalsy();
	expect(isArray([2])).toBeTruthy();
	expect(isArray([2], isObject)).toBeFalsy();
	expect(isArray([2], isNumber)).toBeTruthy();
	expect(isArray({ fist: 'of fury' })).toBeFalsy();
	expect(isArray([{ fist: 'of fury' }])).toBeTruthy();
	const a: any = 2;
	isArray(a) && assertType<unknown[]>(a);
	isArray(a, isNumber) && assertType<number[]>(a);
	isArray(a, isObject) && assertType<Obj[]>(a);
});

test('should test assertObject helper', () => {
	let a: any = 2;
	expect(() => {
		assertObject(a);
		assertType<Obj>(a);
	}).toThrow('Expected object, received number');
	expect(() => {
		a = { fist: 'of fury' };
		assertObject(a);
		assertType<Obj>(a);
	}).not.toThrow();
	expect(() => {
		assertObject({ fist: 'of fury' });
	}).not.toThrow();
});

test('should test assertArray helper', () => {
	let a: any = 2;
	expect(() => {
		a = 2;
		assertArray(a);
		assertType<unknown[]>(a);
	}).toThrow('Expected array, received number');
	expect(() => {
		a = [2];
		assertArray(a);
		assertType<unknown[]>(a);
	}).not.toThrow();
	expect(() => {
		a = [2, 3];
		assertArray(a, assertObject);
		assertType<Obj[]>(a);
	}).toThrow('Invalid array member. Expected object, received number');
	expect(() => {
		a = [2];
		assertArray(a, assertNumber);
		assertType<number[]>(a);
	}).not.toThrow();
	expect(() => {
		a = { fist: 'of fury' };
		assertArray(a);
		assertType<unknown[]>(a);
	}).toThrow('Expected array, received object');
	expect(() => {
		a = [[2]];
		assertArray(a, assertArray);
		assertType<unknown[][]>(a);
	}).not.toThrow();
});
