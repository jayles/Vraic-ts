import MyCounter from './MyCounter.js';
import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
import { Page } from '../../Courgette/Puppeteer/Puppet.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
//import { log } from '../../Courgette/Logger.js';

@Suite('MyCounter component tests')
export default class MyHeaderTests {
	private page!: Page;
	private readonly shadHostPath: string = 'body > div > main > my-counter';

	@BeforeAll
	public async globalSetup() {
		this.page = await puppet.getNewPageAsync();
		await this.page.setViewport({ width: 1920, height: 1080 })
		await this.page.goto('http://localhost:10202/counter', { waitUntil: 'networkidle0' });
	}

	@AfterAll
	public async globalTeardown() {
		await this.page.close();
	}

	private async getCurrCount(): Promise<number> {
		return await this.page.$eval(this.shadHostPath, el => (el as MyCounter).count);
	}

	@Test('Clicking Increment button increases counter by 1')
	public async counterIncreases() {
		// get current count
		const originalCount = await this.getCurrCount();

		// click increment
		await this.page.$eval(this.shadHostPath, el => (el.shadowRoot?.querySelector('div > button:nth-child(4)') as HTMLButtonElement).click());

		// check outcome
		const expectedCount: number = originalCount + 1;
		const actualCount: number = await this.getCurrCount();
		assert.areEqual(expectedCount, actualCount);
	}

	@Test('Clicking Decrement button decreases counter by 1')
	public async counterDecreases() {
		// get current count
		const originalCount: number = await this.getCurrCount();

		// click decrement
		await this.page.$eval(this.shadHostPath, el => (el.shadowRoot?.querySelector('div > button:nth-child(5)') as HTMLButtonElement).click());

		// check outcome
		const actualCount: number = await this.getCurrCount();
		const expectedCount: number = originalCount - 1;
		assert.areEqual(expectedCount, actualCount);
	}

}
