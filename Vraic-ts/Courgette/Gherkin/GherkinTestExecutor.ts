import { IScenario } from '../Gherkin/GherkinMatchers.js';
import { ITestExecutor } from '../VsTestRunner/VsTestRunner.js';
import { VsTestResult } from '../VsTestRunner/VsTestResult.js';
import { log } from '../Logger.js';

export default class GherkinTestExecutor implements ITestExecutor {
	public testResults: Array<VsTestResult> = new Array<VsTestResult>();

	// ctor
	constructor(private fullPathFilename: string) {
	}

	public async runTestsAsync(testFileUrl: string): Promise<Array<VsTestResult>> {
		log.info('Starting Gherkin test runner...');

		// load module with tests
		//let gherkinScenarios = await import('../UnitTestsFake/TestGherkin.gherkin.js');
		let gherkinScenarios = await import(testFileUrl);

		// attempt to enumerate classes in imported module. Not sure is this is possible
		//type ModuleType = typeof gherkinScenarios;
		let classNameList: PropertyKey[] = Reflect.ownKeys(gherkinScenarios);
		for (let className of classNameList)
			console.log(className.toString());

		let scenario: IScenario = new gherkinScenarios.PushItem();

		//let Scenarios = await import('../UnitTestsFake/TestGherkin.gherkin.js');
		//let scenario = new Scenarios.PushItem();

		try {
			let givenArgs = (scenario as any)._given;
			log.dump(givenArgs, 'setupArgs');

			let givenArray = (scenario as any)._given;
			let given: string = givenArray[0].value;

			let whenArray = (scenario as any)._when;
			let when: string = whenArray[0].value;

			let thenArray = (scenario as any)._then;
			let then: string = thenArray[0].value;

			log.info(`Clause: ${given}`);
			scenario.given(0);

			log.info(`Clause: ${when}`);
			scenario.when('Geoff Wode');

			log.info(`Clause: ${then}`);
			scenario.then(1, 0, 'Geoff Wode');

			log.highlight('Your test passed!');
		}
		catch (ex) {
			log.warn('Test failed!');
		}

		// return test results
		return this.testResults;
	}
}
