import Person from './Person.js';
import PersonForm from './PersonForm.js';
import { Suite, Test, BeforeAll, AfterAll, BeforeEach, AfterEach } from '../../Courgette/Courgette/CourgetteDecorators.js';
import { assert } from '../../Courgette/Courgette/CourgetteMatchers.js';
import { Page } from '../../Courgette/Puppeteer/Puppet.js';
import { puppet } from '../../Courgette/VsTestRunner/VsTestRunner.js';
//import { log } from '../../Courgette/Logger.js';

@Suite('PersonForm component tests')
export default class PersonFormTests {
	private page!: Page;

	@BeforeAll
	public async globalSetup() {
		this.page = await puppet.getNewPageAsync();
		await this.page.setViewport({ width: 1920, height: 1080 })
		await this.page.goto('http://localhost:10202/input', { waitUntil: 'networkidle0' });
	}

	@AfterAll
	public async globalTeardown() {
		await this.page.close();
	}

	private async getActualPersonDto(): Promise<Person> {
		let person = await this.page.$eval('body > div > main > person-form', (el: PersonForm) => el.dto);
		return person;
	}

	@Test('Ensure form updates all DTO fields after user clicks Submit button')
	public async checkFormUpdatesDtoFields() {
		const page = this.page;
		const shadHostPath = 'body > div > main > person-form';

		// reset any existing form values
		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-forename]') as HTMLInputElement).value = '');
		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-surname]') as HTMLInputElement).value = '');
		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-age]') as HTMLInputElement).value = '');
		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-dob]') as HTMLInputElement).value = '');

		// create test person data entry data
		let expectedPerson: Person = new Person();
		expectedPerson.forename = 'Geoff';
		expectedPerson.surname = 'Wode';
		expectedPerson.alive = true;
		expectedPerson.dob = new Date(1985, 10, 26);
		expectedPerson.age = 123;

		// enter data & submit form
		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-forename]') as HTMLInputElement).focus());
		await page.keyboard.type(expectedPerson.forename)

		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-surname]') as HTMLInputElement).focus());
		await page.keyboard.type(expectedPerson.surname)

		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-dob]') as HTMLInputElement).focus());
		const dob = expectedPerson.dob;
		const dobString = `${dob.getDate()}${dob.getMonth() + 1}${dob.getFullYear()}`;
		await page.keyboard.type(dobString);

		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-age]') as HTMLInputElement).focus());
		await page.keyboard.type(expectedPerson.age.toString());

		await page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('[data-wci-alive]') as HTMLInputElement).click());

		// click Submit button
		await this.page.$eval(shadHostPath, (el: PersonForm) => (el.shadowRoot?.querySelector('form > button') as HTMLButtonElement).click());

		// check outcome
		const actualPerson: Person = await this.getActualPersonDto();
		assert.areEqual(expectedPerson, actualPerson);
	}
}
