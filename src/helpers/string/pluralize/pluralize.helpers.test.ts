/** cSpell: disable */

import { pluralize } from './pluralize.helpers';

describe('testing pluralize helper', () => {
	it('should should test simple number quantifier', () => {
		expect(pluralize`I have ${1} kitt[en|ies]`).toBe('I have 1 kitten');
		expect(pluralize`I have ${3} kitt[en|ies]`).toBe('I have 3 kitties');
	});

	it('should test multiple pluralizations with one quantifier', () => {
		expect(pluralize`There [is|are] ${1} m[an|en]`).toBe('There is 1 man');
		expect(pluralize`There [is|are] ${5} m[an|en]`).toBe('There are 5 men');
	});

	it('should test for multiple quantifiers', () => {
		expect(pluralize`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`).toBe(
			'There is 1 fox and 4 octopi'
		);
		expect(pluralize`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`).toBe(
			'There are 4 foxes and 1 octopus'
		);
	});

	it('should test printing calculated values for the quantifier', () => {
		expect(pluralize`Her ${[1, 'sole|twin|$1']} br[other|ethren] left`).toBe(
			'Her sole brother left'
		);
		expect(pluralize`Her ${[2, 'sole|twin|$1']} br[other|ethren] left`).toBe(
			'Her twin brethren left'
		);
		expect(pluralize`Her ${[3, 'sole|twin|$1']} br[other|ethren] left`).toBe(
			'Her 3 brethren left'
		);
	});

	const getter = (arg: number) => {
		const count = arg < 12 ? 'less than a' : Math.floor(arg / 12);
		return `${count} dozen`;
	};
	it('should test providing the printing value for quantifier by getter', () => {
		expect(pluralize`She has ${[1, getter]} eggs`).toBe(
			'She has less than a dozen eggs'
		);
		expect(pluralize`She has ${[13, getter]} eggs`).toBe(
			'She has 1 dozen eggs'
		);
		expect(pluralize`She has ${[100, getter]} eggs`).toBe(
			'She has 8 dozen eggs'
		);
	});

	it('should test not printing a value for quantifier', () => {
		expect(pluralize`${[1]} gen[us|era]`).toBe('genus');
		expect(pluralize`${[2]} gen[us|era]`).toBe('genera');
		// can also be done with
		expect(pluralize`${[1, 'genus|genera']}`).toBe('genus');
		expect(pluralize`${[2, 'genus|genera']}`).toBe('genera');
	});

	it('should test optionally printing the value of quantifier', () => {
		expect(pluralize`Delete the ${[1, '|$1']} cact[us|i]?`).toBe(
			'Delete the cactus?'
		);
		expect(pluralize`Delete the ${[2, '|$1']} cact[us|i]?`).toBe(
			'Delete the 2 cacti?'
		);
		expect(pluralize`The function takes ${[1, '$1 or more']} arguments`).toBe(
			'The function takes 1 or more arguments'
		);
		expect(pluralize`The function takes ${[2, '$1 or more']} arguments`).toBe(
			'The function takes 2 or more arguments'
		);
	});

	it('should test more than 2 options', () => {
		expect(
			pluralize`He scored a ${[
				1,
			]} [single|double|triple|quadruple|multi] hundred`
		).toBe('He scored a single hundred');
		expect(
			pluralize`He scored a ${[
				2,
			]} [single|double|triple|quadruple|multi] hundred`
		).toBe('He scored a double hundred');
		expect(
			pluralize`He scored a ${[
				3,
			]} [single|double|triple|quadruple|multi] hundred`
		).toBe('He scored a triple hundred');
		expect(
			pluralize`He scored a ${[
				4,
			]} [single|double|triple|quadruple|multi] hundred`
		).toBe('He scored a quadruple hundred');
		expect(
			pluralize`He scored a ${[
				5,
			]} [single|double|triple|quadruple|multi] hundred`
		).toBe('He scored a multi hundred');
	});

	it('should test more than 2 options for quantifiers value', () => {
		expect(
			pluralize`He scored a ${[1, '|double|triple|quadruple|multi']} hundred`
		).toBe('He scored a hundred');
		expect(
			pluralize`He scored a ${[2, '|double|triple|quadruple|multi']} hundred`
		).toBe('He scored a double hundred');
		expect(
			pluralize`He scored a ${[3, '|double|triple|quadruple|multi']} hundred`
		).toBe('He scored a triple hundred');
		expect(
			pluralize`He scored a ${[4, '|double|triple|quadruple|multi']} hundred`
		).toBe('He scored a quadruple hundred');
		expect(
			pluralize`He scored a ${[5, '|double|triple|quadruple|multi']} hundred`
		).toBe('He scored a multi hundred');
	});

	it('should quantify strings within expressions', () => {
		/* eslint-disable no-constant-condition, @typescript-eslint/no-unnecessary-condition, jest/no-conditional-in-test */
		expect(
			pluralize`I have ${1} ${true ? 'good friend[|s]' : 'bad friend[|s]'}`
		).toBe('I have 1 good friend');
		expect(
			pluralize`I have ${1} ${false ? 'good friend[|s]' : 'bad friend[|s]'}`
		).toBe('I have 1 bad friend');
		expect(
			pluralize`I have ${5} ${true ? 'good friend[|s]' : 'bad friend[|s]'}`
		).toBe('I have 5 good friends');
		expect(
			pluralize`I have ${5} ${false ? 'good friend[|s]' : 'bad friend[|s]'}`
		).toBe('I have 5 bad friends');
		/* eslint-enable no-constant-condition, @typescript-eslint/no-unnecessary-condition, jest/no-conditional-in-test */
	});
});
