import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
import { Page } from '../../Courgette/Puppeteer/Puppet.js';

@Suite('MyFooter component tests')
export default class MyFooterTests {
	private page!: Page;

	@BeforeAll public async globalSetup() {
		this.page = await puppet.getNewPageAsync();
		await this.page.setViewport({ width: 1920, height: 1080 })
		await this.page.goto('http:/localhost:10202/', { waitUntil: 'networkidle0' });
	}

	@AfterAll public async globalTeardown() {
		await this.page.close();
	}

	@Test('Test footer component loads ok')
	public async checkLoaded() {
		// document.querySelector("body > div > my-footer").shadowRoot.querySelector("footer > div")
		const actualFooter: string = await this.page.$eval('body > div > my-footer', el => (el.shadowRoot?.querySelector('footer > div') as HTMLElement).innerText);
		const expectedFooter = "This is the footer (Web Component), (c) Widget Ltd 2019";
		assert.areEqual(expectedFooter, actualFooter);
	}
}
