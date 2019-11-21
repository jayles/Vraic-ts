import { log, check } from '../Logger.js';
//
//	Some notes on decorators
//
//	[1] http://blog.wolksoftware.com/decorators-reflection-javascript-typescript
//	[2] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
//	[3] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//	[4] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4
//
// decorator calling order
//
// [1] params
// [2] attributes
// [3] methods
// [4] class

// Gherkin steps for each scenario/example:
//
//	Given (setup)
//	When (event/action)
//	Then (expected outcome with displayed value)
//
//	And
//	But

// @Scenario class decorator
export function scenario<T extends object>(...items: string[]): Function {
	log.highlight(`@scenario class decorator called`);
	for (let item of items)
		log.highlight(`item=${item}`);

	return (classDesc: Constructor<T> /*ClassDescriptor*/) => {
		log.dump(classDesc, '>> classDesc');

		(ctor: Constructor<T>) => {
			log.error('This never gets called');
			log.highlight(`>> @scenario class decorator called`);
			log.dump(ctor, '>> ctor');
			// @ts-ignore: this implicitly has type any
			this.prototype._clauses = new Array<string>();
			for (let item of items) {
				log.highlight(`>>> @scenario class decorator: item =${item}`);
				// @ts-ignore: this implicitly has type any
				this.prototype._clauses.push(item);
			}
		}
	}
}

// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
export function given<T extends Object>(initConditions: string) {
	const prop = '_given';
	return function (target: T, key: string, value: any) {
		log.highlight(`target=${JSON.stringify(target)}, key=${key}, value=${JSON.stringify(value)}`);
		if (!target.hasOwnProperty(prop))
			Object.defineProperty(target, prop, { value: [{ value: initConditions, writable: true }] });
		else
			(target as any)[prop].push(initConditions);

		// target				current class
		// propertyKey	name of method
		// descriptor		value of Object.getOwnPropertyDescriptor(<target>.prototype, propertyKey)
	}
}

export function when<T extends Object>(actionHappens: string) {
	const prop = '_when';
	return function (target: T, key: string, value: any) {
		log.highlight(`target=${JSON.stringify(target)}, key=${key}, value=${JSON.stringify(value)}`);
		if (!target.hasOwnProperty(prop))
			Object.defineProperty(target, prop, { value: [{ value: actionHappens, writable: true }] });
		else
			(target as any)[prop].push(actionHappens);
	}
}

export function then<T extends Object>(outcome: string) {
	const prop = '_then';
	return function (target: T, key: string, value: any) {
		log.highlight(`target=${JSON.stringify(target)}, key=${key}, value=${JSON.stringify(value)}`);
		if (!target.hasOwnProperty(prop))
			Object.defineProperty(target, prop, { value: [{ value: outcome, writable: true }] });
		else
			(target as any)[prop].push(outcome);
	}
}

export function andthen<T extends Object>(outcome: string) {
	const prop = '_then';
	return function (target: T, key: string, value: any) {
		log.highlight(`target=${JSON.stringify(target)}, key=${key}, value=${JSON.stringify(value)}`);
		if (!target.hasOwnProperty(prop))
			Object.defineProperty(target, prop, { value: [{ value: outcome, writable: true }] });
		else
			(target as any)[prop].push(outcome);
	}
}

//@Component2 class decorator
//export function MyClassDecorator<T extends {}>(tagName: string): Function {
//	log.info(`> Class decorator2 called for : ${tagName}`);

//	return (classDesc: Constructor<T>) => {
//		log.dump(classDesc, '>> classDesc');

//		return class extends classDesc {
//			constructor(...args: any[]) {
//				super(...args);
//			}
//			//public static tag = tagName;
//		}
//}

export function MyPropDecorator(target: Object, name: string)
{
	Object.defineProperty(target, name, {
		get: function () { return this['_' + name]; },
		set: function (value) {
			log.info(`${this.constructor.name}.${name} = ${value}`);
			this['_' + name] = value;
		},
		enumerable: true,
		configurable: true
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// From lib.es5.d.ts:
//
//interface TypedPropertyDescriptor<T> {
//	enumerable?: boolean;
//	configurable?: boolean;
//	writable?: boolean;
//	value?: T;
//	get?: () => T;
//	set?: (value: T) => void;
//}

//declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
//declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
//declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
//declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// property decorator for output properties

// original working version
//export function MyPropDecoratorFactory(...outputDependencies: string[]): (target: Object, propName: string) => void {
//	return (target: Object, propName: string): void => {
//		Object.defineProperty(target, propName, {
//			get: function () { return this['_' + propName]; },
//			set: function (value) {
//				this['_' + propName] = value;
//				this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes
//			},
//			enumerable: true,
//			configurable: true
//		})
//	}
//}

// property decorator for custom attributes
export function Attrib<T extends {}>(target: T, fieldName: string) {
	const kebabName: string = fieldName.replace(/_/g, '-');

	// [1] if not present, create static _observedAttributes field and initialise with {fieldName}
	// if it already exists, add {fieldName} to the list
	if (!target.hasOwnProperty('_observedAttributes')) {
		let propValues: string[] = [fieldName];
		Object.defineProperty(target, '_observedAttributes', { value: propValues });
		//let actualValue: string[] = (target as any)['_observedAttributes'];
	}
	else {
		let obsAttrs: string[] = (target as any)._observedAttributes;
		check(obsAttrs != undefined, `Can't find _observedAttributes on ${target.constructor.name}`);
		obsAttrs.push(kebabName);	// add to list of watched attributes so that we get the attributeChangedCallback() event call
		log.dump((target as any)._observedAttributes, 'New value of obsAttrs');
	}

	// [2] also remember to create the property getter and setter for this attribute
	Object.defineProperty(target, fieldName, {
		get: function () {
			const attribName: string = fieldName.replace(/_/g, '-');	// kebab-case custom attribute name
			let value = (this as HTMLElement).getAttribute(attribName);
			if (value == undefined)
				log.warn(`Could not find attribute '${attribName}' on element ${this.TagName}`);
			return value;
		},
		set: function (value: any) {
			const attribName: string = fieldName.replace(/_/g, '-');	// kebab-case custom attribute name
			log.info(`${this.constructor.name}.${attribName} = ${value}`);
			(this as HTMLElement).setAttribute(attribName, value);
		},
		enumerable: true,
		configurable: true
	});
}
