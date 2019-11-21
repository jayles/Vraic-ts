import SpecTestExecutor from '../Spec/SpecTestExecutor.js';
import GherkinTestExecutor from '../Gherkin/GherkinTestExecutor.js';
import CourgetteTestExecutor from '../Courgette/CourgetteTestExecutor.js';
import { Puppet, Browser, Page, CoverageEntry } from '../Puppeteer/Puppet.js';
import { VsTestResult } from './VsTestResult.js';
import { log } from '../Logger.js';

export interface ITestExecutor {
	runTestsAsync(testFileUrl: string): Promise<Array<VsTestResult>>;
}

export default class VsTestRunner {
	public static puppet: Puppet = new Puppet();

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private getFilenameExtension(fullPathFilename: string) {
		// fullPathFilename is full path filename (using backslashes) with .<test type>.ts extension
		let extension: string = '.' + fullPathFilename.split('\\').pop() ?.split('.').slice(1).join('.');
		return extension;
	}

	public getUrlParam(paramName: string): string {
		const urlParamString = window.location.search
		const urlParams = new URLSearchParams(urlParamString);
		let paramValue = urlParams.get(paramName);
		if (paramValue == null) {
			log.warn(`getUrlParam() could not find url param '${paramName}'`);
			return 'getUrlParam() returned null/undefined';
		}
		return paramValue;
	}

	private async sendResultsToVisualStudioAsync(results: Array<VsTestResult>, vsPort: string) {
		// if no port specfied, don't bother sending results
		if (vsPort == undefined)
			return;

		try {
			let json = JSON.stringify(results);
			//log.debug(`json=${json}`);

			// perform http PUT back to Visual Studio (for courgette unit test adapter plugin)
			let url = `http://localhost:${vsPort}/testResults.json`;
			let response: Response = await window.fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: json
			});
		}
		catch (ex) {
			log.warn(ex);
		}
	}

	//private async getCurrentPageAsync(browser: Browser): Promise<Nullable<Page>> {
	//	let targets = await browser.targets();
	//	const numTargets: number = targets.length;
	//	for (let i = 0; i < numTargets; i++) {
	//		let target = targets[i];
	//		let page = await target.page();
	//		if (page)
	//			return page;
	//	}

	//	return null;
	//}

	//private async startCodeCoverageAsync(wsUri: string) {
	//	let browser: Browser = await this.puppeteer.connectAsync(wsUri);
	//	this.page = await browser.newPage()
	//	let arrayPages: Page[] = await browser.pages();
	//	this.page = arrayPages[0];

	//	let temp = await this.getCurrentPageAsync(browser);
	//	if (temp != null)
	//		this.page = temp;

	//	await this.page.setViewport({ width: 1920, height: 1080 });
	//	await this.page.coverage.startJSCoverage();
	//	await this.page.coverage.startCSSCoverage();
	//}

	//private async stopCodeCoverageAsync() {
	//	let jsEntries: CoverageEntry[] = await this.page.coverage.stopJSCoverage();
	//	//let cssCoverage = await this.page.coverage.stopCSSCoverage();

	//	log.info(`stopJSCoverage() returned ${jsEntries.length} entries`);
	//	for (let i = 0; i < jsEntries.length; i++) {
	//		let entry = jsEntries[i];
	//		log.info(`entry.text = ${entry.text}, entry.url = ${entry.url}`);
	//	}
	//}

	public async RunAsync() {
		// VS2017 calls us with a URL somthing like this:
		//	localhost:10202/TestRunner.html?
		//		wwwroot=C:/Users/john/source/repos/Vraic-ts/Vraic-ts &
		//		testFileUrl=/Components/MyHeader/MyHeaderTests.courgette.ts &
		//		vsPort=8638 &
		//		wsUri=ws://localhost:9222/devtools/browser/14a543a4-3161-4b99-9e71-3bc36ee54ed2
		//
		let wwwroot = this.getUrlParam('wwwroot');														// the root project directory for this test file
		let testFileUrl = this.getUrlParam('testFileUrl');										// relative path to test fiel from wwwroot, this must be passed to us with forward slashes to work
		let vsPort = this.getUrlParam('vsPort');															// when started by Visual Studio, contains the localhost port number to send test results to, i.e. http://localhost:<port>/
		let wsUri: string = this.getUrlParam('wsUri');												// when started by Visual Studio, contains the websocket URI for CDP/puppeteer browser automation
		let fullPathFilename = (wwwroot + testFileUrl).replace(/\//g, '\\');	// convert any forward slashes to backlashes ready to pass back to C# code
		testFileUrl = testFileUrl.replace('.ts', '.js');											// we run the actual tests on the .js files
		log.info(`Starting VS TestRunner for test file ${testFileUrl}`);

		VsTestRunner.puppet.browser = await VsTestRunner.puppet.connectAsync(wsUri);

		// invoke appropriate test runner
		let extension = this.getFilenameExtension(fullPathFilename);
		let runner: Nullish<ITestExecutor>;
		switch (extension) {
			case '.spec.ts':
				runner = new SpecTestExecutor(fullPathFilename);
				break;

			case '.gherkin.ts':
				runner = new GherkinTestExecutor(fullPathFilename);
				break;

			case '.courgette.ts':
				runner = new CourgetteTestExecutor(fullPathFilename);
				break;

			default:
				log.warn(`Unexpected test file extension : ${extension}`);
				runner = undefined;
				break;
		}

		// run the tests
		//await this.startCodeCoverageAsync(wsUri);
		let testResults = await runner?.runTestsAsync(testFileUrl) ?? new Array<VsTestResult>();
		//await this.stopCodeCoverageAsync();

		// dump results to console and send to visual studio as json using http PUT
		log.dump(testResults, 'json test results');
		await this.sendResultsToVisualStudioAsync(testResults, vsPort);

		// show how many tests completed
		let el = document.getElementById('outputMsg');
		if (el != null)
			el.innerHTML = `Unit test run completed, ${testResults.length} tests were run`;
	}
}

export var puppet: Puppet = VsTestRunner.puppet;
