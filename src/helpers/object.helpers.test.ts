import {
	deepMerge,
	objectEntries,
	objectKeys,
	objectValues,
	omit,
	pick,
} from './object.helpers.js';

test('testing objectEntries', () => {
	const object = { first: 1, second: 2 } as const;
	const entries = objectEntries(object);
	expect(entries).toStrictEqual([
		['first', 1],
		['second', 2],
	]);
	assertType<['first' | 'second', 1 | 2][]>(entries);
});

test('testing objectKeys', () => {
	const object = { first: 1, second: 2 } as const;
	const keys = objectKeys(object);
	expect(keys).toStrictEqual(['first', 'second']);
	assertType<('first' | 'second')[]>(keys);
});

test('testing objectValues', () => {
	const object = { first: 1, second: 2 } as const;
	const values = objectValues(object);
	expect(values).toStrictEqual([1, 2]);
	assertType<(1 | 2)[]>(values);
});

test('testing omit with a single key', () => {
	const omitted = { first: 1 };
	const object = { ...omitted, second: 2 };
	const result = omit(object, 'second');
	expect(result).toStrictEqual(omitted);
	assertType<typeof omitted>(result);
});

test('testing omit with multiple keys', () => {
	const omitted = { first: 1 };
	const object = { ...omitted, second: 2, third: 3 };
	const result = omit(object, ['second', 'third']);
	expect(result).toStrictEqual(omitted);
	assertType<typeof omitted>(result);
});

test('testing pick with a single key', () => {
	const picked = { a: 1 };
	const object = { ...picked, b: 2 };
	const result = pick(object, 'a');
	expect(result).toStrictEqual(picked);
	assertType<typeof picked>(result);
});

test('testing pick with multiple keys', () => {
	const picked = { a: 1, b: 2 };
	const object = { ...picked, c: 3 };
	const result = pick(object, ['a', 'b']);
	expect(result).toStrictEqual(picked);
	assertType<typeof picked>(result);
});

test('testing deepMerge', () => {
	const first = { a: 1, b: 'old', nested: { d: 1, e: 'old' } } as const;
	const second = { b: 'new', c: 3, nested: { e: 'new', f: 3 } } as const;
	const merged = {
		a: 1 as const,
		b: 'new' as const,
		c: 3 as const,
		nested: { d: 1 as const, e: 'new' as const, f: 3 as const },
	};
	const result = deepMerge(first, second);
	expect(result).toStrictEqual(merged);
	assertType<typeof merged>(result);
});
