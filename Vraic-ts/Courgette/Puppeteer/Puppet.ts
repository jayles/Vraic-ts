import { Browser, Page, CoverageEntry } from 'puppeteer';
export { Browser, Page, CoverageEntry };
import { log } from '../Logger.js';

// This class allows use of the Puppeteer browser automation API from within the browser using the
// Browserified pupeteer-web.js library (no requirement for Node.js)
// see https://github.com/GoogleChrome/puppeteer/tree/master/utils/browser
//
// The native version of Puppeteer runs under Node.js, so the same tests that run in the desktop browser can also be used within automated Node.js tests started by Team City/Jenkins/etc.
// Supported browsers are Chrome, Chromium, Firefox, Edge 76+ and Opera. Safari and Internet Explorer are not supported.
// see https://github.com/GoogleChrome/puppeteer

// global var created within index.html when it loads puppeteer using require()
declare var puppeteer: typeof import('puppeteer');

export class Puppet {
	public browser!: Browser;
	public page!: Page;

	public sleep(timeMs: number) {
		return new Promise(resolve => setTimeout(resolve, timeMs));
	}

	public async getWsEndpoint(cdpPort: number): Promise<string> {
		let wsUri: string = 'not found';
		try {
			let url = `http://localhost:${cdpPort}/json/version`;
			let response: Response = await window.fetch(url, {
				method: 'GET',
				headers: { 'Accept': 'application/json' },
			});

			let config = await response.json;
			wsUri = (config as any).webSocketDebuggerUrl;
		}
		catch (ex) {
			log.warn(ex.toString());
		}

		return wsUri;
	}

	//public async connectAsync(cdpPort: number): Promise<Browser>;
	public async connectAsync(wsUri: string): Promise<Browser>;
	public async connectAsync(endpoint: string | number): Promise<Browser> {
		// ensure index.html has loaded puppeteer
		// should really try to require('puppeteer') from this class, but that had module import problems,
		// may be able to get round this by editing puppeteer-web.js to use es6 imports on required imports,
		// or possibly by using Babelify on the browserified node.js library
		while (typeof puppeteer === 'undefined' || puppeteer == null) {
			await this.sleep(200);
		}

		let wsUri: string = 'unknown';
		if (typeof endpoint === 'string')
			wsUri = endpoint;
		if (typeof endpoint === 'number')
			wsUri = await this.getWsEndpoint(endpoint);

		this.browser = await puppeteer.connect({ browserWSEndpoint: wsUri });
		return this.browser;
	}

	public async getNewPageAsync(): Promise<Page> {
		this.page = await this.browser.newPage();
		return this.page;
	}

	public async getCurrPageAsync(): Promise<Page> {
		let pages = await this.browser.pages();
		this.page = pages[0];
		return this.page;
	}

	public async testAsync(wsUri: string) {
		this.browser = await this.connectAsync(wsUri)
		const page = await this.browser.newPage();
		await page.goto('http://www.bbc.co.uk/');
		await page.waitForNavigation({ waitUntil: 'networkidle0' });
		// page loaded, now look for elements on page...
	}
}
