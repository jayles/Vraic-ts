import TestSuite from './TestSuite.js';
import TestMethod from './TestMethod.js';
import SpecMatcher from './SpecMatcher.js';

class SpecTestDiscoverer {
	public rootSuite: TestSuite = new TestSuite('root');
	public currSuite: TestSuite = this.rootSuite;

	public setBeforeAll(globalSetupFn: Function) {
		this.currSuite.beforeAll = globalSetupFn;
	}

	public setAfterAll(globalTeardownFn: Function) {
		this.currSuite.afterAll = globalTeardownFn;
	}

	public setBeforeEach(testSetupFn: Function) {
		this.currSuite.beforeEach = testSetupFn;
	}

	public setAfterEach(testTeardownFn: Function) {
		this.currSuite.afterEach = testTeardownFn;
	}

	public addTestSuite(desc: string, suiteFn: Function) {
		// create new test suite and add as child to current test suite
		let newSuite = new TestSuite(desc);
		newSuite.parent = this.currSuite;
		this.currSuite.children.push(newSuite);

		// preserve existing suite, set currSuite to the new suite & invoke the describe() function. Afterwards restore original test suite.
		let prevSuite = this.currSuite;
		this.currSuite = newSuite;
		suiteFn();
		this.currSuite = prevSuite;
	}

	public addTestMethod(desc: string, testFn: Function) {
		// create new test method and add to current test suite
		let newTest = new TestMethod(desc, testFn);
		this.currSuite.tests.push(newTest);
	}

	public expect(result: any): SpecMatcher {
		let matcher = new SpecMatcher(result);
		return matcher;
	}
}

export var discoverer = new SpecTestDiscoverer();
export var describe: (desc: string, fn: Function) => void = discoverer.addTestSuite.bind(discoverer);
export var it: (str: string, fn: Function) => void = discoverer.addTestMethod.bind(discoverer);
export var expect: (result: any) => SpecMatcher = discoverer.expect.bind(discoverer);
export var beforeAll:  (fn: Function) => void = discoverer.setBeforeAll.bind(discoverer);
export var afterAll:   (fn: Function) => void = discoverer.setAfterAll.bind(discoverer);
export var beforeEach: (fn: Function) => void = discoverer.setBeforeEach.bind(discoverer);
export var afterEach:  (fn: Function) => void = discoverer.setAfterEach.bind(discoverer);
