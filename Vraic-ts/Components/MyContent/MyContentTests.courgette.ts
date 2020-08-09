//import MyContent from './MyContent.js';
import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
import { Page } from '../../Courgette/Puppeteer/Puppet.js';
import MyContent from '../MyContent/MyContent.js';
//import { log } from '../../Courgette/Logger.js';

@Suite('MyContent component tests')
export default class MyContentTests {
	private page!: Page;
	private expectedA: number = 7;
	private expectedB: number = 11;
	private expectedC: string = 'propC';
	private readonly shadHostPath = 'body > div > main > my-content';

	@BeforeAll
	public async globalSetup() {
		this.page = await puppet.getNewPageAsync();
		const page = this.page;

		await page.setViewport({ width: 1920, height: 1080 })
		await page.goto('http://localhost:10202/', { waitUntil: 'networkidle0' });

		// set input A
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-a]') as HTMLInputElement).value = '');
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-a]') as HTMLInputElement).focus());
		await page.keyboard.type(this.expectedA.toString());

		// set input B
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-b]') as HTMLInputElement).value = '');
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-b]') as HTMLInputElement).focus());
		await page.keyboard.type(this.expectedB.toString());

		// set input C
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-c]') as HTMLInputElement).value = '');
		await page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wci-c]') as HTMLInputElement).focus());
		await page.keyboard.type(this.expectedC);
	}

	@AfterAll
	public async globalTeardown() {
		await this.page.close();
	}

	@Test('Ensure property C updates')
	public async checkPropCUpdates() {
		// check outcome
		//const hShadowHost = await this.page.$(this.shadHostPath);
		//const actualC = await this.page.evaluate(el => el.shadowRoot?.querySelector('[data-wco-c]').innerHTML, hShadowHost);
		const actualC: string = await this.page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wco-c]') as HTMLElement).innerHTML);
		assert.areEqual(this.expectedC, actualC);
	}

	@Test('Ensure property d has value of hello')
	public async checkPropDhasValueHello() {
		// check outcome
		const actualD: string = await this.page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wco-d]') as HTMLElement).innerHTML);
		assert.areEqual('hello', actualD);
	}

	@Test('Ensure addition of 7 + 11 = 18')
	public async checkAdditionTotalIs18() {
		// check outcome
		const additionTotal: string = await this.page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wco-total]') as HTMLElement).innerHTML);
		const expectedTotal = this.expectedA + this.expectedB;
		const actualTotal = Number.parseInt(additionTotal);
		assert.areEqual(expectedTotal, actualTotal);
	}

	@Test('Ensure multiplication of 7 * 11 = 77')
	public async checkMultiplicationTotalIs77() {
		// check outcome
		const additionTotal: string = await this.page.$eval(this.shadHostPath, (el: MyContent) => (el.shadowRoot?.querySelector('[data-wco-mult]') as HTMLElement).innerHTML);
		const expectedProduct = this.expectedA * this.expectedB;
		const actualProduct = Number.parseInt(additionTotal);
		assert.areEqual(expectedProduct, actualProduct);
	}

}
