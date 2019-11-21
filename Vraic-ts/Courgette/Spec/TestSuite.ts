import TestMethod from './TestMethod.js';

export default class TestSuite {
	constructor(public desc: string) {
		// fully-qualified name is suite names/descriptions with dot separator
		this.fqName = (this.parent == null) ? desc : this.parent.fqName + '.' + desc;
	}

	public fqName: string = '';
	public parent: Nullable<TestSuite> = null;
	public children: Array<TestSuite> = new Array<TestSuite>();
	public tests: Array<TestMethod> = new Array<TestMethod>();
	public beforeAll: Function | undefined = undefined;
	public afterAll: Function | undefined = undefined;
	public beforeEach: Function | undefined = undefined;
	public afterEach: Function | undefined = undefined;
}
