import { Puppet, Browser, Page, CoverageEntry } from '../Puppeteer/Puppet.js';
import { log } from '../Logger.js';
import { ITestExecutor } from '../VsTestRunner/VsTestRunner.js';
import { VsTestResult } from '../VsTestRunner/VsTestResult.js';
import TestSuite from './TestSuite.js';
//import TestItem from './TestItem.js';

// see the following for using puppeeter within the browser (without Node.js)
//
//	https://github.com/GoogleChrome/puppeteer/blob/master/utils/browser/README.md
//
export default class CourgetteTestExecutor implements ITestExecutor {
	public testResults: Array<VsTestResult> = new Array<VsTestResult>();

	// ctor
	constructor(private fullPathFilename: string) {
	}

	public callMethod(methodName: string | undefined, testClass: any): void {
		let funcName = methodName as keyof typeof testClass;
		testClass[funcName]();
	}

	public async runTestsAsync(testFileUrl: string) {
		log.info('Starting CourgetteTestExecutor...');

		// load module with tests
		let courgetteTests = await import(testFileUrl);

		try {

			// instantiate the test suite class (should be the default export)
			let testClass = new courgetteTests.default();
			type TestClass = typeof testClass;
			let testSuite = (testClass as any)._testSuite as TestSuite;

			// test suite setup
			let beforeAllMethod = testSuite.beforeAll as keyof TestClass;
			await testClass[beforeAllMethod]?.();

			for (let item of testSuite.testItems) {
				// individual test setup
				//this.callMethod(testSuite.beforeEach, testClass);
				let beforeEachMethod = testSuite.beforeEach as keyof TestClass;
				await testClass[beforeEachMethod]?.();

				let testResult: VsTestResult = new VsTestResult();
				testResult.testFilename = this.fullPathFilename;
				testResult.fqName = testSuite.suiteDescription + '.' + item.testDescription;
				testResult.displayName = item.testDescription;
				testResult.startTime = new Date();

				try {
					// run the test
					let testMethod = item.testFnName as keyof TestClass;
					await testClass[testMethod]?.();

					// passed
					testResult.testOutcome = VsTestResult.TestOutcome.Passed;
				}
				catch (ex) {
					// failed
					log.warn(ex.toString());
					testResult.testOutcome = VsTestResult.TestOutcome.Failed;
					testResult.saveErrorInfo(ex);
				}
				finally {
					// always save the test result
					testResult.endTime = new Date();
					testResult.durationMs = testResult.endTime.valueOf() - testResult.startTime.valueOf();
					this.testResults.push(testResult);
				}

				// individual test teardown
				let afterEachMethod = testSuite.afterEach as keyof TestClass;
				await testClass[afterEachMethod]?.();
			}

			// test suite teardown
			let afterAllMethod = testSuite.afterAll as keyof TestClass;
			await testClass[afterAllMethod]?.();
		}
		catch (ex) {
			log.warn('Test failed!');
		}

		// return test results
		return this.testResults;
	}
}
