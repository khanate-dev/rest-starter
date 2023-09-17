/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable vitest/no-conditional-in-test */
/* eslint-disable vitest/no-conditional-tests */
/** cSpell: disable */

import { pluralize } from './pluralize.helpers.js';

test('testing pluralize with simple number quantifier', () => {
	expect(pluralize`I have ${1} kitt[en|ies]`).toBe('I have 1 kitten');
	expect(pluralize`I have ${3} kitt[en|ies]`).toBe('I have 3 kitties');
});

test('testing pluralize with multiple pluralizations with one quantifier', () => {
	expect(pluralize`There [is|are] ${1} m[an|en]`).toBe('There is 1 man');
	expect(pluralize`There [is|are] ${5} m[an|en]`).toBe('There are 5 men');
});

test('testing pluralize with for multiple quantifiers', () => {
	expect(pluralize`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`).toBe(
		'There is 1 fox and 4 octopi',
	);
	expect(pluralize`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`).toBe(
		'There are 4 foxes and 1 octopus',
	);
});

test('testing pluralize with printing calculated values for the quantifier', () => {
	expect(pluralize`Her ${[1, 'sole|twin|$1']} br[other|ethren] left`).toBe(
		'Her sole brother left',
	);
	expect(pluralize`Her ${[2, 'sole|twin|$1']} br[other|ethren] left`).toBe(
		'Her twin brethren left',
	);
	expect(pluralize`Her ${[3, 'sole|twin|$1']} br[other|ethren] left`).toBe(
		'Her 3 brethren left',
	);
});

const getter = (arg: number) => {
	const count = arg < 12 ? 'less than a' : Math.floor(arg / 12);
	return `${count} dozen`;
};
test('testing pluralize with providing the printing value for quantifier by getter', () => {
	expect(pluralize`She has ${[1, getter]} eggs`).toBe(
		'She has less than a dozen eggs',
	);
	expect(pluralize`She has ${[13, getter]} eggs`).toBe('She has 1 dozen eggs');
	expect(pluralize`She has ${[100, getter]} eggs`).toBe('She has 8 dozen eggs');
});

test('testing pluralize with not printing a value for quantifier', () => {
	expect(pluralize`${[1]} gen[us|era]`).toBe('genus');
	expect(pluralize`${[2]} gen[us|era]`).toBe('genera');
	// can also be done with
	expect(pluralize`${[1, 'genus|genera']}`).toBe('genus');
	expect(pluralize`${[2, 'genus|genera']}`).toBe('genera');
});

test('testing pluralize with optionally printing the value of quantifier', () => {
	expect(pluralize`Delete the ${[1, '|$1']} cact[us|i]?`).toBe(
		'Delete the cactus?',
	);
	expect(pluralize`Delete the ${[2, '|$1']} cact[us|i]?`).toBe(
		'Delete the 2 cacti?',
	);
	expect(pluralize`The function takes ${[1, '$1 or more']} arguments`).toBe(
		'The function takes 1 or more arguments',
	);
	expect(pluralize`The function takes ${[2, '$1 or more']} arguments`).toBe(
		'The function takes 2 or more arguments',
	);
});

test('testing pluralize with more than 2 options', () => {
	expect(
		pluralize`He scored a ${[
			1,
		]} [single|double|triple|quadruple|multi] hundred`,
	).toBe('He scored a single hundred');
	expect(
		pluralize`He scored a ${[
			2,
		]} [single|double|triple|quadruple|multi] hundred`,
	).toBe('He scored a double hundred');
	expect(
		pluralize`He scored a ${[
			3,
		]} [single|double|triple|quadruple|multi] hundred`,
	).toBe('He scored a triple hundred');
	expect(
		pluralize`He scored a ${[
			4,
		]} [single|double|triple|quadruple|multi] hundred`,
	).toBe('He scored a quadruple hundred');
	expect(
		pluralize`He scored a ${[
			5,
		]} [single|double|triple|quadruple|multi] hundred`,
	).toBe('He scored a multi hundred');
});

test('testing pluralize with more than 2 options for quantifiers value', () => {
	expect(
		pluralize`He scored a ${[1, '|double|triple|quadruple|multi']} hundred`,
	).toBe('He scored a hundred');
	expect(
		pluralize`He scored a ${[2, '|double|triple|quadruple|multi']} hundred`,
	).toBe('He scored a double hundred');
	expect(
		pluralize`He scored a ${[3, '|double|triple|quadruple|multi']} hundred`,
	).toBe('He scored a triple hundred');
	expect(
		pluralize`He scored a ${[4, '|double|triple|quadruple|multi']} hundred`,
	).toBe('He scored a quadruple hundred');
	expect(
		pluralize`He scored a ${[5, '|double|triple|quadruple|multi']} hundred`,
	).toBe('He scored a multi hundred');
});

test('should quantify strings within expressions', () => {
	expect(
		pluralize`I have ${1} ${true ? 'good friend[|s]' : 'bad friend[|s]'}`,
	).toBe('I have 1 good friend');
	expect(
		pluralize`I have ${1} ${false ? 'good friend[|s]' : 'bad friend[|s]'}`,
	).toBe('I have 1 bad friend');
	expect(
		pluralize`I have ${5} ${true ? 'good friend[|s]' : 'bad friend[|s]'}`,
	).toBe('I have 5 good friends');
	expect(
		pluralize`I have ${5} ${false ? 'good friend[|s]' : 'bad friend[|s]'}`,
	).toBe('I have 5 bad friends');
});
