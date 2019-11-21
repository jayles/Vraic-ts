class Assert {

	// ctor
	public constructor() {
	}

	// compare two dates
	private dateAreEqual(expected: Date | null | undefined, actual: Date | null | undefined): boolean {
		return (expected?.getTime() === actual?.getTime());
	}

	// deep compare of two objects (including nested, arrays, maps, etc)
	private deepCompare(expected: object | null | undefined, actual: object | null | undefined): boolean {
		// this will work for simple cases, but not for { a:1, b:2 } === { b:2, a:1 }
		const expectedJson = JSON.stringify(expected);
		const actualJson = JSON.stringify(actual);
		let same = (expectedJson === actualJson);
		return same;
	}

	// internal areEqual
	private internalAreEqual(expected: any, actual: any): boolean {
		// overloaded method, checks for equality
		let areSame: boolean = false;
		if ((expected === null) && (actual === null))	// typeof null === 'object', so need to deal with this edge-case first
			areSame = true
		else
			if ((expected instanceof Date) && (actual instanceof Date))	// dates
				areSame = this.dateAreEqual(expected, actual)
			else
				if ((typeof expected === 'object') && (typeof actual === 'object'))	// objects, arrays, maps, etc (and note also typeof null === 'object')
					areSame = this.deepCompare(expected, actual)
				else
					areSame = (expected === actual);	// string | boolean | number

		return areSame;
	}

	// are equal
	public areEqual(expected: Nullish<boolean>, actual: Nullish<boolean>): void;
	public areEqual(expected: Nullish<number>, actual: Nullish<number>): void;
	public areEqual(expected: Nullish<string>, actual: Nullish<string>): void;
	public areEqual(expected: Nullish<Date>, actual: Nullish<Date>): void;
	public areEqual(expected: Nullish<object>, actual: Nullish<object>): void;
	public areEqual(expected: AlmostAny, actual: AlmostAny): boolean {
		// overloaded method, checks for equality
		let same: boolean = this.internalAreEqual(expected, actual);
		if (same)
			return true;
		else
			throw new Error(`areEqual(expected=${expected} [${typeof expected}], actual=${actual} [${typeof actual}]) test assertion failed`);
	}

	// are not equal
	public areNotEqual(expected: Nullish<boolean>, actual: Nullish<boolean>): void;
	public areNotEqual(expected: Nullish<number>, actual: Nullish<number>): void;
	public areNotEqual(expected: Nullish<string>, actual: Nullish<string>): void;
	public areNotEqual(expected: Nullish<Date>, actual: Nullish<Date>): void;
	public areNotEqual(expected: Nullish<object>, actual: Nullish<object>): void;
	public areNotEqual(expected: AlmostAny, actual: AlmostAny): boolean {
		// overloaded method, checks for inequality
		let same: boolean = this.internalAreEqual(expected, actual);
		if (!same)
			return true;
		else
			throw new Error(`areNotEqual(expected=${expected} [${typeof expected}], actual=${actual} [${typeof actual}]) test assertion failed`);
	}

	// see https://dev.to/krumpet/generic-type-guard-in-typescript-258l
	public isInstanceOf<T extends object>(classType: Constructor<T>, obj: T) {
		if (!(obj instanceof classType))
		throw new Error('isInstanceOf() test assertion failed');
	}

	public isDefined(param: any) {
		if (typeof param === 'undefined')
			throw new Error('isDefined() test assertion failed');
	}

	public isUndefined(param: any) {
		if (typeof param !== 'undefined')
			throw new Error('isUndefined() test assertion failed');
	}

	public isNull(param: any) {
		if (param !== null)
			throw new Error('isNull() test assertion failed');
	}

	public isNotNull(param: any) {
		if (typeof param === 'undefined')
			return;
		if (param === null)
			throw new Error('isNotNull() test assertion failed');
	}

	public isNullish(param: any) {
		if (param != null)
			throw new Error('isNullish() test assertion failed');
	}

	public isNotNullish(param: any) {
		if (param == null)
			throw new Error('isNotNullish() test assertion failed');
	}

	public isTruthy(param: any) {
		if (!param)
			throw new Error('isTruthy() test assertion failed');
	}

	public isFalsey(param: any) {
		if (param)
			throw new Error('isFalsey() test assertion failed');
	}

	public contains(srcString: string, subString: string) {
		if (srcString.indexOf(subString) < 0)
			throw new Error('contains() test assertion failed');
	}

	// DOM Helpers
	public hasClass(el: HTMLElement, className: string) {
		if (!el.classList.contains(className))
			throw new Error('hasClass() test assertion failed');
	} 

}
export var assert: Assert = new Assert();
