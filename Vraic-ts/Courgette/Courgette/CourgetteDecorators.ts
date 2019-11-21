import { log } from '../Logger.js';
import TestItem from './TestItem.js';
import TestSuite from './TestSuite.js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	[1] http://blog.wolksoftware.com/decorators-reflection-javascript-typescript
//	[2] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
//	[3] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//	[4] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4
//
// Decorator calling order:
//
// 1st: [1] Params [2] Methods [3] Accessors (get/set) [4] Properties (fields): decorators are applied for each instance member
// 2nd: [1] Params [2] Methods [3] Accessors (get/set) [4] Properties (fields): decorators are applied for each static member
// 3rd: [1] Params decorators are applied for the constructor
// 4th: [1] Class decorators are applied for the class
//
// Courgette decorators:
//
//	@TestSuite
//	@Test
//	@BeforeAll
//	@AfterAll
//	@BeforeEach
//	@AfterEach
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

declare type MyClassDecorator = <T extends Object>(target: Constructor<T>) => void; /* | Function */
declare type MyMethodDecorator = <T extends Object>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => /*TypedPropertyDescriptor<T> |*/ void;

interface ITestSuite {
	_testSuite: TestSuite;
}

//function getSuite<T extends Object>(classObject: T): ITestSuite {
//	return classObject as any as ITestSuite;
//}

function ensureTestSuiteExists<T extends Object>(classObject: T) {
	if (!classObject.hasOwnProperty('_testSuite')) {
		log.highlight(`_testSuite was NOT found on ${classObject.constructor.name}, adding now...`);
		let testSuite = new TestSuite('not yet discovered', classObject.constructor.name);
		Object.defineProperty(classObject, '_testSuite', { value: testSuite, writable: true });
	}
	else
		log.highlight(`_testSuite WAS found on ${classObject.constructor.name}`);
}

// @TestSuite class decorator
export function Suite<T extends object>(testSuiteDescription: string): MyClassDecorator {
	log.highlight(`@TestSuite class decorator factory called`);

	return function<T extends Object>(classDesc: Constructor<T>) {
		log.highlight(`@TestSuite class decorator called`);
		log.dump(classDesc, 'classDesc');

		// set the test suite description (class name should already have been set)
		//let suite: ITestSuite = getSuite(classDesc);
		let suite: ITestSuite = classDesc as any as ITestSuite;
		ensureTestSuiteExists(classDesc);
		suite._testSuite.suiteDescription = testSuiteDescription;
		//check(suite._testSuite.className === classDesc.prototype.name, 'Courgette_Decorators.Suite() decorator: class name mismatch');

		//(ctor: Constructor<T>) => {
		//	log.highlight(`@TestSuite class ctor called`);
		//	log.dump(ctor, 'ctor');
		//}
	}
}

export function Test<T extends Object>(testDescription: string): MyMethodDecorator {
	return function<T extends Object>(classObject: Object, methodName: string, methodDescriptor: TypedPropertyDescriptor<T>): void {
		log.highlight(`target=${JSON.stringify(classObject)}, methodName=${methodName}, methodDescriptor=${JSON.stringify(methodDescriptor)}`);

		ensureTestSuiteExists(classObject);
		let testItem = new TestItem(testDescription, methodName);
		(classObject as any as ITestSuite)._testSuite.testItems.push(testItem);
	}
}

export function BeforeAll<T extends Object>(classObject: Object, methodName: string, methodValue: TypedPropertyDescriptor<T>) {
	log.highlight(`target=${JSON.stringify(classObject)}, methodName=${methodName}, methodValue=${JSON.stringify(methodValue)}`);
	ensureTestSuiteExists(classObject);
	(classObject as any as ITestSuite)._testSuite.beforeAll = methodName;
}

export function AfterAll<T extends Object>(classObject: Object, methodName: string, methodValue: TypedPropertyDescriptor<T>) {
	log.highlight(`target=${JSON.stringify(classObject)}, methodName=${methodName}, methodValue=${JSON.stringify(methodValue)}`);
	ensureTestSuiteExists(classObject);
	(classObject as any as ITestSuite)._testSuite.afterAll = methodName;
}

export function BeforeEach<T extends Object>(classObject: Object, methodName: string, methodValue: TypedPropertyDescriptor<T>) {
	log.highlight(`target=${JSON.stringify(classObject)}, methodName=${methodName}, methodValue=${JSON.stringify(methodValue)}`);
	ensureTestSuiteExists(classObject);
	(classObject as any as ITestSuite)._testSuite.beforeEach = methodName;
}

export function AfterEach<T extends Object>(classObject: Object, methodName: string, methodValue: TypedPropertyDescriptor<T>) {
	log.highlight(`target=${JSON.stringify(classObject)}, methodName=${methodName}, methodValue=${JSON.stringify(methodValue)}`);
	ensureTestSuiteExists(classObject);
	(classObject as any as ITestSuite)._testSuite.afterEach = methodName;
}
