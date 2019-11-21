import TestItem from './TestItem.js';

export default class TestSuite {
	constructor(
		public suiteDescription: string,
		public className: string) {
		this.testItems = new Array<TestItem>();
	}

	public beforeAll:  string | undefined = undefined;
	public afterAll:   string | undefined = undefined;
	public beforeEach: string | undefined = undefined;
	public afterEach:  string | undefined = undefined;

	public testItems: Array<TestItem>;
}
