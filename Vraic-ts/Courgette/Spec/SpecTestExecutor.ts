import TestSuite from './TestSuite.js';
import { discoverer } from './SpecTestDiscoverer.js';
import { ITestExecutor } from '../VsTestRunner/VsTestRunner.js';
import { VsTestResult } from '../VsTestRunner/VsTestResult.js';

export default class SpecTestExecutor implements ITestExecutor {
	public testResults: Array<VsTestResult> = new Array<VsTestResult>();

	// ctor
	constructor(private fullPathFilename: string) {
	}

	private runTestSuite(parentSuite: TestSuite): Array<VsTestResult> {
		try {
			parentSuite.beforeAll?.();
			this.runTestsWithinSuite(parentSuite);
			for (let childSuite of parentSuite.children) {
				this.runTestSuite(childSuite);
			}
			parentSuite.afterAll?.();
		}
		catch (ex) {
			// something wrong in beforeAll or afterAll functions
			// consider creating a fake test error so that the user gets a stack trace link to click on
		}

		// pass back all the test outcomes
		return this.testResults;
	}

	private runTestsWithinSuite(parentSuite: TestSuite) {
		// run all the tests in this test suite and create a VsTestResult for every test
		for (let test of parentSuite.tests) {
			let result: VsTestResult = new VsTestResult();
			result.testFilename = this.fullPathFilename;
			result.fqName = parentSuite.fqName + '.' + test.desc;
			result.displayName = test.desc;
			result.startTime = new Date();

			try {
				parentSuite.beforeEach?.();
				test.testFn();
				parentSuite.afterEach?.();

				// test passed
				result.testOutcome = VsTestResult.TestOutcome.Passed;
			}
			catch (ex) {
				// test failed
				result.testOutcome = VsTestResult.TestOutcome.Failed;
				result.saveErrorInfo(ex);
			}
			finally {
				// always save the test result
				result.endTime = new Date();
				result.durationMs = result.endTime.valueOf() - result.startTime.valueOf();
				this.testResults.push(result);
			}
		}
	}

	public async runTestsAsync(testFileUrl: string): Promise<Array<VsTestResult>> {
		// importing es6 module will execute it, which will find all the tests via the SpecTestDiscoverer class
		// Note the .spec.ts file will import the SpecTestDiscoverer class which exports the 'discoverer' var:
		//	export var discoverer = new SpecTestDiscoverer();
		//
		/*let specTestModule =*/ await import(testFileUrl);
		let testResults = this.runTestSuite(discoverer.rootSuite);
		return testResults;
	}
}
