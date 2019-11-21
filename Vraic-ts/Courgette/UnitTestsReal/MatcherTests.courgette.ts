import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../Courgette/CourgetteDecorators.js';
import { assert } from '../Courgette/CourgetteMatchers.js';
//import { log } from '../Logger.js';

// Matchers to add
// ===============
//
// toMatch()							to check whether a value matches a string or a regular expression
// toMatchObject					

// toBeNaN
// toContain()						to check whether a string or array contains a substring or an item.
// toContainEqual					
// toBeCloseTo()					for precision math comparison

// Jasmine
// spy matchers (Jasmine)
// toHaveBeenCalled
// toHaveBeenCalledBefore
// toHaveBeenCalledTimes
// toHaveBeenCalledWith
// toHaveClass						// see if DOM element has specified CSS class
//
// toThrow()							for testing if a function throws an exception
// toThrowError()					for testing a specific thrown exception
// toThrowMatching()

// found in jest:
// toHaveLength						
// toHaveProperty					

// Might also require these (for decorator testing)
// toHaveField
// toHaveStaticField
// toHaveProperty (get/set)
// toHaveStaticProperty (get/set)
// toHaveMethod
// toHaveStaticMethod

class Person {
	//constructor() {
	//	this.name = 'Geoff';
	//	this.age = 123;
	//	this.dob = new Date(1969, 12, 31);
	//}

	constructor(
		public name: string = 'Geoff',
		public age: number = 123,
		public dob: Date = new Date(),
		public mother: Nullish<Person> = null,
		public father: Nullish<Person> = null) {
		}
}

//interface IPerson {
//	name: string;
//	age: number;
//	dob: Date;
//}

@Suite('Courgette matchers/assert tests')
export default class CourgetteMatchersTest {

	//@BeforeAll public async globalSetup() {
	//}

	//@AfterAll public async globalTeardown() {
	//}

	//@BeforeEach public async testSetup() {
	//}

	//@AfterEach public async testTeardown() {
	//}

	@Test('Test areEqual() with all data types and include deep compare test')
	public async areEqual() {
		let date = new Date();

		assert.areEqual(true, true);
		assert.areEqual(false, false);
		assert.areEqual(1, 1);
		assert.areEqual(1.12345, 1.12345);
		assert.areEqual(date, date);
		assert.areEqual('a', 'a');
		assert.areEqual(undefined, undefined);
		assert.areEqual(null, null);

		// shallow object compare
		let clone1: Person = new Person();
		let clone2: Person = new Person();
		assert.areEqual(clone1, clone2);

		// deep object compare
		let mother = new Person('mother', 30, new Date());
		let father = new Person('father', 29, new Date());
		clone1.mother = mother;
		clone1.father = father;
		clone2.mother = mother;
		clone2.father = father;
		assert.areEqual(clone1, clone2);
	}

	@Test('Test areNotEqual() with all data types and include deep compare test')
	public async areNotEqual() {
		let date1 = new Date(1999, 12, 31, 23, 59, 59, 998);
		let date2 = new Date(1999, 12, 31, 23, 59, 59, 999);

		// need to disable type checking to ensure vanilla JavaScript doesn't fail
		// @ts-ignore
		assert.areNotEqual(true, 'true');
		// @ts-ignore
		assert.areNotEqual(false, 'false');
		// @ts-ignore
		assert.areNotEqual(true, 1);
		// @ts-ignore
		assert.areNotEqual(false, 0);

		// @ts-ignore
		assert.areNotEqual('1', 1);

		// test the following types:
		//	boolean | number | Date | string | object | undefined | null
		assert.areNotEqual(true, false);
		assert.areNotEqual(1, 2);
		assert.areNotEqual(date1, date2);
		assert.areNotEqual('a', 'b');
		assert.areNotEqual(undefined, null);

		assert.areNotEqual(true, null);
		assert.areNotEqual(1, null);
		assert.areNotEqual(new Date(), null);
		assert.areNotEqual('a', null);

		assert.areNotEqual(true, undefined);
		assert.areNotEqual(1, undefined);
		assert.areNotEqual(new Date(), undefined);
		assert.areNotEqual('a', undefined);
	}

	@Test('Test isLessThan() with all data types')
	public async isLessThan() {
		//assert.isLessThan(2,1);
	}

// toBeLessThan()					for mathematical comparisons of less than
// toBeLessThanOrEqual		for mathematical comparisons of less than or equal
// toBeGreaterThan()			for mathematical comparisons of greater than
// toBeGreaterThanOrEqual	for mathematical comparisons of greater than or equal

	@Test('Test instanceOf<T> with different object types including Date')
	public async isInstanceOf() {
		let person = new Person();
		assert.isInstanceOf(Person, person);

		let date = new Date();
		assert.isInstanceOf(Date, date);
	}

	@Test('Test isDefined with different object types')
	public async isDefined() {
		let b: boolean = true;
		assert.isDefined(b);

		let x: number = 1;
		assert.isDefined(x);

		let s: string = 'a';
		assert.isDefined(s);

		assert.isDefined(new Person());
		assert.isDefined(new Date());
	}

	@Test('Failing Test isDefined (test should fail)')
	public async isDefinedFail() {
		// @ts-ignore
		assert.isDefined(window.eatEventListener);
	}

	@Test('Test isUndefined')
	public async isUndefined() {
		// @ts-ignore
		assert.isUndefined(window.eatEventListener);
	}

	@Test('Failing Test isUndefined (test should fail)')
	public async isUndefinedFail() {
		// @ts-ignore
		assert.isUndefined(window.addEventListener);
	}

	@Test('Test isNull')
	public async isNull() {
		assert.isNull(null);
	}

	@Test('Failing Test isNull 1 (test should fail)')
	public async isNullFail1() {
		assert.isNull(undefined);
	}

	@Test('Failing Test isNull 2 (test should fail)')
	public async isNullFail2() {
		// @ts-ignore
		assert.isNull(window.eatEventListener);
	}

	@Test('Test isNotNull')
	public async isNotNull() {
		assert.isNotNull(0);
		assert.isNotNull(true);
		assert.isNotNull(false);
		assert.isNotNull('a');
		assert.isNotNull('');
		assert.isNotNull(undefined);
		// @ts-ignore
		assert.isNotNull(window.eatEventListener);
	}

	@Test('Failing Test isNotNull (test should fail)')
	public async isNotNullFail() {
		assert.isNotNull(null);
	}

	@Test('Test isNullish')
	public async isNullish() {
		assert.isNullish(null);
		assert.isNullish(undefined);
		// @ts-ignore
		assert.isNullish(window.eatEventListener);
	}

	@Test('Failing Test isNullish 1 (test should fail)')
	public async isNullishFail1() {
		assert.isNullish(0);
	}

	@Test('Failing Test isNullish 2 (test should fail)')
	public async isNullishFail2() {
		assert.isNullish('');
	}

	@Test('Failing Test isNullish 3 (test should fail)')
	public async isNullishFail3() {
		assert.isNullish([]);
	}

	@Test('Test isNotNullish')
	public async isNotNullish() {
		assert.isNotNullish(0);
		assert.isNotNullish(true);
		assert.isNotNullish(false);
		assert.isNotNullish('a');
		assert.isNotNullish('');
	}

	@Test('Failing Test isNotNullish 1 (test should fail)')
	public async isNotNullishFail1() {
		assert.isNotNullish(null);
	}

	@Test('Failing Test isNotNullish 2 (test should fail)')
	public async isNotNullishFail2() {
		assert.isNotNullish(undefined);
	}

	@Test('Failing Test isNotNullish 3 (test should fail)')
	public async isNotNullishFail3() {
		// @ts-ignore
		assert.isNotNullish(window.eatEventListener);
	}

	@Test('Test isTruthy')
	public async isTruthy() {
		assert.isTruthy(true);
		assert.isTruthy(new Boolean(false));
		assert.isTruthy(1);
		assert.isTruthy(-1);
		assert.isTruthy(new Date());
		assert.isTruthy('a');
	}

	@Test('Test isFalsey')
	public async isFalsey() {
		assert.isFalsey(false);
		assert.isFalsey(0);
		assert.isFalsey('');
		assert.isFalsey(undefined);
		assert.isFalsey(null);
		assert.isFalsey(NaN);
	}

	// DOM helpers
	@Test('Test if HTMLElement has css class')
	public async hasClass() {
		let el = document.createElement("div");
		el.classList.add('classA', 'classB', 'classC');
		assert.hasClass(el, 'classA');
		assert.hasClass(el, 'classB');
		assert.hasClass(el, 'classC');
	}

}
