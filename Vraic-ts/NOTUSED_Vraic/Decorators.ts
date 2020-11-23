﻿import BaseComponent from './BaseComponent.js';
import { log, assert } from './Logger.js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Since JavaScript decorators are still only at stage 2 in the TC39 spec, they are only available via TypeScript or Babel
//	TC39 spec: https://github.com/tc39/proposal-decorators
//
//	Good articles on decorators are hard to find, here are some better ones:
//
//	[1] http://blog.wolksoftware.com/decorators-reflection-javascript-typescript
//	[2] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
//	[3] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//	[4] http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// need to add some tests to this
// see: https://basarat.gitbooks.io/typescript/docs/testing/jest.html
// and also: 
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TC39 def
//interface ClassDescriptor {
//	kind: 'class';
//	elements: ClassElement[];
//	finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
//}

// TC39 def
//interface ClassElement {
//	kind: 'field' | 'method';
//	key: PropertyKey;
//	placement: 'static' | 'prototype' | 'own';
//	initializer?: Function;
//	extras?: ClassElement[];
//	finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
//	descriptor?: PropertyDescriptor;
//}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @Component class decorator
export function Component<T extends BaseComponent>(tagName: string): Function {
	log.info(`> Class decorator called for : ${tagName}`);

	return (classDesc: Constructor<T> /*ClassDescriptor*/) => {
		log.dump(classDesc, '>> classDesc');

		// check that static tag field is defined, if not, then add it to class
		const fieldName: string = 'tag';
		if (!classDesc.hasOwnProperty(fieldName)) {
			log.info(`>> Class ${classDesc.constructor.name} does not have own static field '${fieldName}', attempting to define and initialise to '${tagName}' now`);
			Object.defineProperty(classDesc, fieldName, { value: tagName });
		}

		(ctor: Constructor<T>) => {
			log.dump(ctor, '>>> ctor');
			//log.info(`>>> Trying to set static field BaseComponent.tag = ${tagName}`);
			//BaseComponent.tag = tagName;
			//log.info(`>>> static field was set BaseComponent.tag = ${BaseComponent.tag}`);
		}

		// register the component
		log.info(`>> Registering component class=${classDesc.constructor.name}, html tag=${tagName}`);
		customElements.define(tagName, classDesc);
	}
}

// @Freeze class decorator
export function Freeze(target: Function): void {
	let classDef = target.toString();
	let bracketPos: number = classDef.indexOf('{')
	let className = classDef.slice(0, bracketPos);
	console.log(`@Freeze called for ${className}`);
	Object.freeze(target);
	Object.freeze(target.prototype);
	//return (classDesc: Constructor<T>) => {
	//	let ownProps = Reflect.getOwnPropertyDescriptor.xxx;
	//	for (prop of props) {
	//		if (typeof prop === 'object')
	//			FreezeObjectAndChildren(prop);
	//	}
	//}
}

// @Component2 class decorator
//export function Component2<T extends BaseComponent>(tagName: string): Function {
//	log.info(`> Class decorator2 called for : ${tagName}`);

//	return (classDesc: Constructor<T>) => {
//		log.dump(classDesc, '>> classDesc');

//		return class extends classDesc {
//			public static tag = tagName;
//		}

//		// register the component
//		log.info(`>> Registering component class=${classDesc.constructor.name}, html tag=${tagName}`);
//		customElements.define(tagName, classDesc);
//	}
//}

//export function Prop(target: Object, name: string)
//{
//	Object.defineProperty(target, name, {
//		get: function () { return this['_' + name]; },
//		set: function (value) {
//			log.info(`${this.constructor.name}.${name} = ${value}`);
//			this['_' + name] = value;
//		},
//		enumerable: true,
//		configurable: true
//	});
//}

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

// *** newest spicy 3 version ***
//
//function deco2(...deps: string[]): (target: any, propName: string) => void;
//function deco2(target: any, propName: string): void;
//function deco2(...deps: any): any

function definePropWithoutDeps(target: Object, propName: string): any {
	// Note that the shorthand notation (without Object.defineProperty(...) doesn't work fro PropOut() scenario
	return Object.defineProperty(target, propName, {
		get: function () { return this['_' + propName]; },
		set: function (value: any) {
			log.info(`definePropWithoutDeps(): ${this.constructor.name}.${propName} = ${value}`);
			this['_' + propName] = value;
			if (typeof value === 'object') {
				log.highlight(`definePropWithoutDeps(): object detected, calling UpdateChildElementsContent('${propName}')`);
				this.UpdateChildElementsContent(propName);
			}
			else {
				this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes
			}
			log.info(`No other deps to update for prop '${propName}'`)
		}
	});
}

	//return Object.defineProperty(target, propName, {
	//	get: function () { return this['_' + propName]; },
	//	set: function (value) {
	//		log.info(`${this.constructor.name}.${propName} = ${value}`);
	//		this['_' + propName] = value;
	//		this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes
	//		log.info(`No deps to update for prop '${propName}'`);
	//	},
	//	enumerable: true,
	//	configurable: true
	//})

//interface IPropDecorator{
//	target: Object,
//	propName: string
//}

//interface IPropDecoratorFactory {
//	deps: string[]
//}

export function Output(...deps: string[]): (target: Object, propName: string) => void;
export function Output(target: Object, propName: string): void;
export function Output(...deps: any): any {
//export function PropOut3(...deps: (string|Object)[]) {
	//let target: Object = deps[0];
	//let propName: string = deps[1];

	log.info(`typeof(deps[0])=${typeof (deps[0])}`);
	let stringArgs: boolean = typeof deps[0] === 'string';
	if (stringArgs) {
		// this is a property decorator factory, this returns the decorator function
		// when this property changes, we need to ensure we update all the dependent properties specified on the property decorator
		log.info(`Defining setter with deps`);
		return function (target: Object, propName: string) {
			Object.defineProperty(target, propName, {
				get: function () { return this['_' + propName]; },
				set: function (value) {
					log.info(`${this.constructor.name}.${propName} = ${value}`);
					this['_' + propName] = value;
					this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes

					// update any other output <span> elements that are dependent on this property's value
					for (let dep of deps) {
						log.info(`PropOut3: calling SetElementContent('${dep}') from setter for property ${propName}`);
						this.SetElementContent(dep);
					}
				},
				enumerable: true,
				configurable: true
			})
		}
	}
	else {
		// not a list of string args, therefore this is a property decorator (not a decorator factory), hence there are no property dependencies specified
		log.info(`Defining setter **without** deps`);
		if (deps[0] == undefined) {
			// user has specified @PropOut() ... (with brackets but without parameters, treat the same as @PropOut ...)
			return function (target: Object, propName: string) {
				definePropWithoutDeps(target, propName);
			}
		}
		else {
			// we were pased a target and property name as params [0] and [1], so use those
			return definePropWithoutDeps(deps[0], deps[1]);
		}
	} // end else
}

// new version
//export function PropOut2(): any;															// @PropOut public myProp: string
export function PropOut2(deps: string[]): any;									// @PropOut(...) public myProp: string
//export function PropOut2(...deps: string[]): any;							// causes error: cannot assign to readonly property
export function PropOut2(target: Object, propName: string): any;// @PropOut public myProp: string
export function PropOut2(depsOrTarget?: string[]|Object, _?: string): any {
	let typeofDeps = typeof depsOrTarget;
	log.info(`typeofDeps=${typeofDeps}`);
	//let stringArray: boolean = ((depsOrTarget?.length >= 1) && (typeof depsOrTarget[0] === 'string'));
	let stringArray: boolean = (Array.isArray(depsOrTarget) && (typeof depsOrTarget[0] === 'string'));
	log.info(`stringArray = ${stringArray}`);
	if (stringArray) {
		log.info(`Defining setter with deps`);
		return function (target: Object, propName: string) {
			Object.defineProperty(target, propName, {
				get: function () { return this['_' + propName]; },
				set: function (value) {
					log.info(`${this.constructor.name}.${propName} = ${value}`);
					this['_' + propName] = value;
					this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes

					// update any other output <span> elements that are dependent on this property's value
					if (Array.isArray(depsOrTarget)) {
						for (let dep of depsOrTarget) {
							log.info(`PropOut2: calling SetElementContent('${dep}') from setter for property ${propName}`);
							this.SetElementContent(dep);
						}
					}
				},
				enumerable: true,
				configurable: true
			})
		}
	}
	else {
		log.info(`Defining setter **without** deps`);
		return (target: Object, propName: string) => {
			Object.defineProperty(target, propName, {
				get: function () { return this['_' + propName]; },
				set: function (value) {
					log.info(`${this.constructor.name}.${propName} = ${value}`);
					this['_' + propName] = value;
					this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes
				},
				enumerable: true,
				configurable: true
			})
		}
	}
}

// original working version
export function PropOut(...outputDependencies: string[]): (target: Object, propName: string) => void {
	return (target: Object, propName: string) => {
		Object.defineProperty(target, propName, {
			get: function () { return this['_' + propName]; },
			set: function (value) {
				log.info(`${this.constructor.name}.${propName} = ${value}`);
				this['_' + propName] = value;
				this.SetElementContent(propName);	// update corresponding output <span> whenever this property changes

				// update any other output <span> elements that are dependent on this property's value
				if (outputDependencies == undefined)
					return;
				for (let dep of outputDependencies) {
					log.info(`PropOut1: calling SetElementContent('${dep}') from setter for property ${propName}`);
					this.SetElementContent(dep);
				}
			},
			enumerable: true,
			configurable: true
		})
	}
}

// property decorator for custom attributes
export function Attrib<T extends BaseComponent>(target: T, fieldName: string) {
	const kebabName: string = fieldName.replace(/_/g, '-');
	log.info(`@Attrib called, fieldName=${fieldName}, kebabName=${kebabName}`);

	// if not present, create static _observedAttributes field and initialise with {fieldName}
	// if it already exists, add {fieldName} to the list
	if (!target.hasOwnProperty('_observedAttributes')) {
		log.info(`Class ${target.constructor.name} does not have own field '_observedAttributes', attempting to define now`);
		//let propValues: string[] = ['bacon', target.constructor.name, fieldName];
		let propValues: string[] = [fieldName];
		Object.defineProperty(target, '_observedAttributes', { value: propValues });
		let actualValue: string[] = (target as any)['_observedAttributes'];
		log.dump(actualValue, `${target.constructor.name}._observedAttributes`);
	}
	else {
		log.info(`Class ${target.constructor.name} already has own field '_observedAttributes'`);
		let obsAttrs: string[] = (target as any)._observedAttributes;
		assert(obsAttrs != undefined, `Can't find _observedAttributes on ${target.constructor.name}`);
		log.dump(obsAttrs, 'Old value of obsAttrs');
		obsAttrs.push(kebabName);	// add to list of watched attributes so that we get the attributeChangedCallback() event call
		log.dump((target as any)._observedAttributes, 'New value of obsAttrs');
	}

	// also remember to create the property getter and setter for this attribute
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
