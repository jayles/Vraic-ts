import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
//import { Puppet } from '../../Courgette/Puppeteer/Puppet.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
import MyHeader from './MyHeader.js';
//import { log } from '../../Courgette/Logger.js';

@Suite('MyHeader component tests')
export default class MyHeaderTests {

	//@BeforeAll public async globalSetup() {
	//}

	//@AfterAll public async globalTeardown() {
	//}

	//@BeforeEach public async testSetup() {
	//}

	//@AfterEach public async testTeardown() {
	//}

	@Test('Test header component loads ok')
	public async checkLoaded() {
		let page = await puppet.getNewPageAsync();
		await page.setViewport({ width: 1920, height: 1080 })
		await page.goto('http:/localhost:10202/', { waitUntil: 'networkidle0' });
		//await page.waitForNavigation({ waitUntil: 'networkidle0' });

		// get shadow host for my-header component
		const hShadowHost = await page.$("body > div > my-header");

		//const elHandle = await page.$("head > title");
		//const text = await page.evaluate(el => el.textContent, elHandle);
		//assert.areEqual(text, 'Vraic Web Components App');

		const title = await page.$eval("head > title", (el: HTMLElement) => el.textContent);
		assert.areEqual(title, 'Vraic Web Components App');

		//let div1: string = await page.$eval('body > div > my-header', el => el.shadowRoot?.querySelector('#div1')?.innerHTML) ?? '';
		const div1 = await page.evaluate((el: MyHeader) => el.shadowRoot?.querySelector('#div1')?.innerHTML, hShadowHost);
		assert.areEqual(div1, "This is the header (Web Component)");

		//let div2: string = await page.$eval('body > div > my-header', el => el.shadowRoot?.querySelector('#div2') ?.innerHTML) ?? '';
		const div2 = await page.evaluate((el: MyHeader) => el.shadowRoot?.querySelector('#div2')?.innerHTML, hShadowHost);
		assert.areEqual(div2, "Page title 1 is 'My Title'");

		//let div3: string = await page.$eval('body > div > my-header', el => el.shadowRoot?.querySelector('#div3') ?.innerHTML) ?? '';
		const div3 = await page.evaluate((el: MyHeader) => el.shadowRoot?.querySelector('#div3')?.innerHTML, hShadowHost);
		assert.areEqual(div3, "my-cust-attrib is 'Custom Attribute'");

		//let div4: string = await page.$eval('body > div > my-header', el => el.shadowRoot?.querySelector('#div4') ?.innerHTML) ?? '';
		const div4 = await page.evaluate((el: MyHeader) => el.shadowRoot?.querySelector('#div4')?.innerHTML, hShadowHost);
		assert.areEqual(div4, "Page title 2 is 'My Title'");

		//let divContent: string[] = await page.$$eval('body > div > my-header', el => el.shadowRoot?.querySelector('#div1') ?.innerHTML)

		//let divContent: string[] = await page.$$eval('body > div > my-header', divs => divs.map(({ innerHTML }) => innerHTML));
		//assert.contains(divContent[0], "This is the header (Web Component)");
		//assert.contains(divContent[1], "Page title 1 is 'My Title'");
		//assert.contains(divContent[2], "my-cust-attrib is 'Custom Attribute'");
		//assert.contains(divContent[3], "Page title 2 is 'My Title'");

		await page.close();
	}
}
