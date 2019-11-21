
export interface IScenario {
	given(...args: any[]): void;
	when(...args: any[]): void;
	then(...args: any[]): void;
}

class Assert {

	// ctor
	public constructor() {
	}

	// are equal
	public areEqual(param1: number, param2: number): void;
	public areEqual(param1: string, param2: string): void;
	public areEqual(param1: string | number, param2: string | number): void {
		if (param1 === param2)
			return;
		else
			throw new Error('areEqual() test assertion failed');
	}

	// are equal
	public areNotEqual(param1: number, param2: number): void {
		if (param1 !== param2)
			return;
		else
			throw new Error('areNotEqual() test assertion failed');
	}

}
export var assert: Assert = new Assert();
