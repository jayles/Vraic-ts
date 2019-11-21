import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '../Spec/SpecTestDiscoverer.js';

// see https://github.com/jasmine/jasmine/tree/master/spec/core/matchers for Jasmine spec tests

describe('Jasmine/Jest style spec matchers tests', () => {

	beforeAll(() => console.log('Starting all unit tests...'));
	afterAll(() => console.log('...all unit tests completed'));

	describe('toBe() tests', () => {

		beforeEach(() => console.log('About to run single test [inner wrapper]'));
		afterEach(() => console.log('Single test completed [inner wraapper]'));

		it('should expect(true).tobe(true) [boolean]', function () {
			expect(true).toBe(true);
		});

		it('should expect(1).toBe(1) [number]', function () {
			expect(1).toBe(1);
		});

		it("should expect('a').toBe('a') [string]", function () {
			expect('a').toBe('a');
		});

		it('should expect(<current date>).toBe(<current date>) [Date]', function () {
			let date = new Date();
			expect(date).toBe(date);
		});
	});

	describe('not.toBe() tests', () => {
		it('should expect(true).not.toBe(false) [boolean]', function () {
			expect(true).not.toBe(false);
		});

		it('should expect(1).not.toBe(2) [number]', function () {
			expect(1).not.toBe(2);
		});

		it('should expect(1).not.toBe(null) [number]', function () {
			expect(1).not.toBe(null);
		});

		it('should expect(1).not.toBe(undefined) [number]', function () {
			expect(1).not.toBe(undefined);
		});

	});

	describe('toEqual() tests', () => {
		it('should expect(true).toEqual(true) [boolean]', function () {
			expect(true).toEqual(true);
		});
	});

	describe('toBeDefined() tests', () => {
		it('should expect(window.addEventListener).tobe(defined)', function () {
			expect(window.addEventListener).toBeDefined();
		});
	});

	describe('toBeUndefined() tests', () => {
		it("should expect(typeof window.eatEventListener).tobe('undefined')", function () {
			// @ts-ignore
			expect(window.eatEventListener).not.toBeDefined();
			expect(void 0).not.toBeDefined();
		});
	});

	describe('toBeNull() tests', () => {
		it('should expect(null).toBe(null)', function () {
			expect(null).toBeNull();
			expect(void 0).not.toBeNull();
			expect(undefined).not.toBeNull();
		});
	});

	describe('toBeTrue() tests', () => {
		it('should expect(true).toBe(true)', function () {
			expect(true).toBe(true);
		});
	});

	describe('toBeFalse() tests', () => {
		it('should expect(false).toBe(false)', function () {
			expect(false).toBe(false);
		});
	});

	describe('toBeTruthy() tests', () => {
		it('should expect truthy values to be true', function () {
			expect(true).toBeTruthy();
			expect(1).toBeTruthy();
			expect('a').toBeTruthy();
			expect(new Date()).toBeTruthy();
			expect([]).toBeTruthy();
			expect({}).toBeTruthy();
		});
	});

	describe('toBeFalsey() tests', () => {
		it('should expect falsey values to be false', function () {
			expect(false).toBeFalsey();
			expect(0).toBeFalsey();
			expect('').toBeFalsey();
			expect(null).toBeFalsey();
			expect(undefined).toBeFalsey();
			expect(void 0).toBeFalsey();
			// @ts-ignore
			expect(window.eatEventListener).toBeFalsey();
		});
	});

	describe('toBeNan() tests', () => {
		it('should expect NaN to be NaN', function () {
			expect(Math.sqrt(-1)).toBeNaN();
		});
	});

	describe('toBeGreaterThan() tests', () => {
		it('should expect larger number > smaller number', function () {
			expect(2).toBeGreaterThan(1);
			expect(1).toBeGreaterThan(0);
			expect(0).toBeGreaterThan(-1);
			expect(-1).toBeGreaterThan(-2);
		});
	});

	describe('toBeGreaterThanOrEqual() tests', () => {
		it('should expect larger/same number >= smaller/same number', function () {
			expect(1).toBeGreaterThanOrEqual(0);
			expect(0).toBeGreaterThanOrEqual(-1);
			expect(-1).toBeGreaterThanOrEqual(-2);
			expect(1).toBeGreaterThanOrEqual(1);
			expect(0).toBeGreaterThanOrEqual(0);
			expect(-1).toBeGreaterThanOrEqual(-1);
		});
	});

	describe('toBeLessThan() tests', () => {
		it('should expect smaller number < larger number', function () {
			expect(1.129).toBeLessThan(1.13);
			expect(1).toBeLessThan(2);
			expect(0).toBeLessThan(1);
			expect(-1).toBeLessThan(0);
			expect(-2).toBeLessThan(-1);
		});
	});

	describe('toBeGreaterThanOrEqual() tests', () => {
		it('should expect smaller/same number <= larger/same number', function () {
			expect(1).toBeLessThanOrEqual(2);
			expect(0).toBeLessThanOrEqual(1);
			expect(-1).toBeLessThanOrEqual(0);
			expect(-2).toBeLessThanOrEqual(-1);
			expect(1).toBeLessThanOrEqual(1);
			expect(0).toBeLessThanOrEqual(0);
			expect(-1).toBeLessThanOrEqual(-1);
			expect(-2).toBeLessThanOrEqual(-2);
		});
	});

	describe('toBeCloseTo() tests', () => {
		it('should expect similar numbers to be considered equal', function () {
			expect(10 / 3).toBeCloseTo(3.333, 3);
			expect(Math.PI).toBeCloseTo(3.14159, 5);
			expect(0.1).toBeCloseTo(0.1, 1);
			expect(1).not.toBeCloseTo(2, 1);
		});
	});

	describe('toContain() tests', () => {
		it('should expect string to contain substring', function () {
			let phrase = 'The cat sat on the mat';
			expect(phrase).toContain('cat');
			expect(phrase).not.toContain('dog');
		});

		it('should expect array to contain element', function () {
			// bug: need to fix incorrect match of split( matching for it( in regex within TestAdapter test discovery phase
			let space = ' ';
			let array: Array<string> = 'The cat sat on the mat'.split(space);
			expect(array).toContain('cat');
			expect(array).not.toContain('dog');
		});
	});

	describe('toBeInstanceOf() tests', () => {
		it('should expect objects to be of specified type', function () {
			let dateVar: Date = new Date();
			let stringVar: string = 'hello string';
			let StringVar: String = new String('hello');

			expect(dateVar).toBeInstanceOf(Date);
			expect(dateVar).not.toBeInstanceOf(String);

			expect(stringVar).not.toBeInstanceOf(String);
			expect(StringVar).toBeInstanceOf(String);
		});
	});

});

// toMatch()							to check whether a value matches a string or a regular expression
// toMatchObject					
