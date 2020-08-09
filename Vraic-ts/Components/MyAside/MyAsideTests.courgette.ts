import HtmlPage from '../HtmlPage/HtmlPage.js';
import MyAside from '../MyAside/MyAside.js';
import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
import { Page } from '../../Courgette/Puppeteer/Puppet.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
//import { log } from '../../Courgette/Logger.js';

@Suite('MyAside component tests')
export default class MyAsideTests {
	private page!: Page;

	@BeforeAll
	public async globalSetup() {
		this.page = await puppet.getNewPageAsync();
		await this.page.setViewport({ width: 1920, height: 1080 })
		await this.page.goto('http://localhost:10202/', { waitUntil: 'networkidle0' });
	}

	@AfterAll
	public async globalTeardown() {
		await this.page.close();
	}

	private async getCurrPageName(): Promise<string> {
		const pageName: string = await this.page.$eval('body > div > main > html-page', (el: HtmlPage) => el.PageName);
		return pageName;
	}

	@Test('Clicking on News page link navigates to News page')
	public async checkNewsPageLoads() {

		// click on News page link
		await this.page.$eval('body > div > my-aside', (el: MyAside) => (el.shadowRoot?.querySelector('aside > ul > li:nth-child(2)') as HTMLElement).click());
		//await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
		await this.page.waitFor(100);	// we're getting data from local disk, not from network

		// check outcome
		const expectedPageName = 'news';
		const actualPageName: string = await this.getCurrPageName();
		assert.areEqual(expectedPageName, actualPageName);
	}

	@Test('Clicking on Contact link navigates to Contact page')
	public async checkContacPageLoads() {

		// click on Contact page link
		await this.page.$eval('body > div > my-aside', (el: MyAside) => (el.shadowRoot?.querySelector('aside > ul > li:nth-child(3)') as HTMLElement).click());
		//await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
		await this.page.waitFor(100);	// we're getting data from local disk, not from network

		// check outcome
		const expectedPageName = 'contact';
		const actualPageName: string = await this.getCurrPageName();
		assert.areEqual(expectedPageName, actualPageName);
	}

	@Test('Clicking on About page link navigates to About page')
	public async checkAboutPageLoads() {

		// click on About page link
		await this.page.$eval('body > div > my-aside', (el: MyAside) => (el.shadowRoot?.querySelector('aside > ul > li:nth-child(4)') as HTMLElement).click());
		//await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
		await this.page.waitFor(100);	// we're getting data from local disk, not from network

		// check outcome
		const expectedPageName = 'about';
		const actualPageName: string = await this.getCurrPageName();
		assert.areEqual(expectedPageName, actualPageName);
	}

}
