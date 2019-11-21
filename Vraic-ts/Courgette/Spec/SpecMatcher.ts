import { log } from '../Logger.js';

//
// Matchers in Jest
// ================
//
// toBe()									passed if the actual value is of the same type and value as that of the expected value. It compares with === operator (deep equality???)
// toStrictEqual()				synonym of above?
// toEqual()							works for simple literals and variables, should work for objects too
//
// toMatch()							to check whether a value matches a string or a regular expression
// toMatchObject()
// toMatchSnapshot()
// toMatchInlineSnapshot()
//
// toBeDefined()					to ensure that a property or a value is defined
// toBeUndefined()				to ensure that a property or a value is undefined
// toBeNull()							to ensure that a property or a value is null.
// toBeTruthy()						to ensure that a property or a value is true
// ToBeFalsy()						to ensure that a property or a value is false
// toBeNaN
// toContain()						to check whether a string or array contains a substring or an item.
// toContainEqual					
// toBeLessThan()					for mathematical comparisons of less than
// toBeLessThanOrEqual		for mathematical comparisons of less than or equal
// toBeGreaterThan()			for mathematical comparisons of greater than
// toBeGreaterThanOrEqual	for mathematical comparisons of greater than or equal
// toBeCloseTo()					for precision math comparison
// toBeInstanceOf					
//
// toHaveBeenCalled()
// toHaveBeenCalledTimes()
// toHaveBeenCalledWith()
// toHaveBeenLastCalledWith()
// toHaveBeenNthCalledWith()
// toHaveReturned()
// toHaveReturnedTimes(number)
// toHaveReturnedWith()
// toHaveLastReturnedWith()
// toHaveNthReturnedWith()
// toHaveLength()
// toHaveProperty()
//
// toThrow()
// toThrowErrorMatchingSnapshot()
// toThrowErrorMatchingInlineSnapshot(inlineSnapshot)

// Matchers in Jasmine
// ===================
//
// ???

// May also require these
// ======================
//
// toHaveField
// toHaveStaticField
// toHaveProperty (get/set)
// toHaveStaticProperty (get/set)
// toHaveMethod
// toHaveStaticMethod

export default class SpecMatcher {
	public invertedLogic: boolean = false;

	constructor(private actual: any) {
		// we need to ensure type safety for
		// number | string | boolean | Date | object (Array) | object (other)
	}

	// deep compare of two objects (including nested, arrays, maps, etc)
	private deepCompare(param1: object | null | undefined, param2: object | null | undefined): boolean {
		// this will work for simple cases, but not for { a:1, b:2 } === { b:2, a:1 }
		let same = JSON.stringify(param1) === JSON.stringify(param2);
		return same;
	}

	private checkResult(funcName: string, testPassed: boolean, expected: any, actual: any) {
		if (this.invertedLogic)
			testPassed = !testPassed;

		let resultMsg = testPassed ? 'Test passed' : 'Test Failed';
		let assertMsg = `${funcName}(expected=${expected} [${typeof expected}]), actual=${actual} [${typeof actual}]: ${resultMsg}`;

		if (testPassed) {
			log.success(assertMsg);
			return;
		}
		else {
			log.fail(assertMsg);
			throw new Error(assertMsg);
		}
	}

	public get not(): SpecMatcher {
		// allow for double+ negatives
		this.invertedLogic = !this.invertedLogic;
		return this;
	}

	// toBe
	public toBe(expected: boolean): void;
	public toBe(expected: number): void;
	public toBe(expected: string): void;
	public toBe(expected: Date): void;
	public toBe(expected: object): void;
	public toBe(expected: null): void;
	public toBe(expected: undefined): void;
	public toBe(expected: AlmostAny): void {
		this.checkResult('toBe', this.actual === expected, expected, this.actual);
	}

// toStrictEqual()				synonym of above?

	// toEqual
	public toEqual(expected: any): void {
		this.checkResult('toEqual', this.actual === expected, expected, this.actual);
	}

	// toBeDefined
	public toBeDefined(): void {
		this.checkResult('toBeDefined', typeof this.actual !== 'undefined', 'defined', this.actual);
	}

	// toBeUndefined
	public toBeUndefined(): void {
		this.checkResult('toBeUndefined', typeof this.actual === 'undefined', 'undefined', this.actual);
	}

	// toBeNull
	public toBeNull(): void {
		this.checkResult('toBeNull', this.actual === null, 'null', this.actual);
	}

	// toBeTrue
	public toBeTrue(): void {
		this.checkResult('toBeTrue', this.actual === true, 'true', this.actual === true);
	}

	// toBeFalse
	public toBeFalse(): void {
		this.checkResult('toBeFalse', this.actual === false, 'false', this.actual === false);
	}

	// toBeTruthy
	public toBeTruthy(): void {
		this.checkResult('toBeTruthy', !!this.actual === true, 'truthy', !!this.actual);
	}

	// toBeFalsey
	public toBeFalsey(): void {
		this.checkResult('toBeFalsey', !this.actual === true, 'falsey', !this.actual);
	}

	// toBeNaN
	public toBeNaN(): void {
		this.checkResult('toBeNaN', this.actual !== this.actual, 'NaN', NaN);
	}

	// toContain
	// to check whether a string or array contains a substring or an item
	public toContain(str: string): void;
	public toContain<T>(array: Array<T>): void;
	public toContain<T>(expected: string | Array<T>): void {
		let found: number = -1;
		if (this.actual != null && expected != null) {
			found = this.actual.indexOf(expected);
		}
		this.checkResult('toContain', found > 0, expected, this.actual);
	}

	// toContainEqual
	// find matching object in array using deep object compare
	public toContainEqual(item: any) {
		if (this.actual != null && typeof Array.isArray(this.actual)) {
			let found: boolean = false;
			for (let elem of this.actual) {
				found = this.deepCompare(this.actual, elem);
				if (found)
					break;
			}
			this.checkResult('toContainEqual', found, item, this.actual);
		}
	}

	// toBeLessThan
	public toBeLessThan(expected: number): void {
		this.checkResult('toBeLessThan', this.actual < expected, expected, this.actual);
	}

	// toBeLessThanOrEqual
	public toBeLessThanOrEqual(expected: number): void {
		this.checkResult('toBeLessThanOrEqual', this.actual <= expected, expected, this.actual);
	}

	// toBeGreaterThan
	public toBeGreaterThan(expected: number): void {
		this.checkResult('toBeGreaterThan', this.actual > expected, expected, this.actual);
	}

	// toBeGreaterThanOrEqual
	public toBeGreaterThanOrEqual(expected: number): void {
		this.checkResult('toBeGreaterThanOrEqual', this.actual >= expected, expected, this.actual);
	}

	// toBeCloseTo
	public toBeCloseTo(expected: number, digitPrecison: number) {
		let power = Math.pow(10, digitPrecison + 1)
		let diff = Math.abs(this.actual - expected);
		let maxDiff = Math.pow(10, - digitPrecison) / 2;
		let passedTest = Math.round(diff * power) <= maxDiff * power;
		this.checkResult('toBeCloseTo', passedTest, expected, this.actual);
	}

	// toBeInstanceOf
	//public toBeInstanceOf<T extends Object>(classType: Constructor<T>, obj: T): void {
	//	this.checkResult('toBeInstanceOf', obj instanceof classType, classType, obj.constructor.name);
	//}
	public toBeInstanceOf<T extends Object>(classType: Constructor<T>): void {
		this.checkResult('toBeInstanceOf', this.actual instanceof classType, classType, this.actual.constructor.name);
	}

// toMatch()							to check whether a value matches a string or a regular expression
// toMatchObject					
}
