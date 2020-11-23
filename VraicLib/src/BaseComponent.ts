﻿// Web Components Spec
// ===================
// see https://html.spec.whatwg.org/multipage/custom-elements.html
// and https://html.spec.whatwg.org/multipage/custom-elements.html#customelementregistry
//
// Web Components Articles
// =======================
// Web Component Recommendations:	https://open-wc.org/guide/
// Good Overview article:					https://blog.usejournal.com/web-components-will-replace-your-frontend-framework-3b17a580831c
// Another overview:							https://blog.logrocket.com/understanding-shadow-dom-v1-fa9b81ebe3ac/
// Google recommendations:				https://developers.google.com/web/fundamentals/web-components/best-practices
// Bugs/shortcomings:							https://dev.to/webpadawan/beyond-the-polyfills-how-web-components-affect-us-today-3j0a
//
//	Web Components registration API
//	===============================
//	window.customElements.define(name, constructor)
//	window.customElements.define(name, constructor, { extends: baseLocalName })
//	window.customElements.whenDefined(name)
//	window.customElements.get(name)
//	window.customElements.upgrade(root)
//
//	Web Components lifecycle callbacks
//	==================================
//	connectedCallback()					called when added to DOM
//	disconnectedCallback()			called when removed from DOM
//	adoptedCallback()						called when moved to new document
//	attributeChangedCallback()	called when observed attributes change
//
//	static get observedAttributes()		returns string array of observed attributes

//import { Freeze } from './PropDecorator.js';
import { Router, IComponent, IRoute } from './Router.js';
import { TemplateParser } from './TemplateParser.js';
import { log, assert } from './Logger.js';

//@Freeze
export default class BaseComponent extends HTMLElement
{
	// Note that TypeScript is unable to reference derived class static members from the base class without some casting, so
	// you need to do this:
	//	(this.constructor as any).MyStaticProperty (accesses derived class copy, not base class copy)
	//
	//	see https://github.com/Microsoft/TypeScript/issues/3841
	//	and possible workaround: https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146

	// see https://github.com/microsoft/TypeScript/issues/5863
	// ES6 proposal has been added: link???

	// static fields

	// router (singleton)
	public static Router: Router = new Router();

	// html tag name
	public static tag: string = "BaseComponent (not used)";
	public get TagName(): string {
		return (this.constructor as any).tag;
	}
	//public set TagName(value: string) {
	//	(this.constructor as any).tag = value;
	//}

	// get component name (class name) in PascalCase rather than kebab-case: MyNewComponent vs my-new-component
	public get ClassName() {
		//return BaseComponent.getClassName(this.TagName);
		return this.constructor.name;
	}

	public static getClassName(tagIn: string): string {
		let tag = tagIn.toLowerCase();
		tag = tag[0].toUpperCase() + tag.slice(1);
		let name = tag.replace(/-([a-z])/gi, (_, part) => part.toUpperCase());
		log.highlight(`getClassName() converted ${tagIn} to ${name}`);
		return name;
	}

	private _knownOutputFields: Array<string> = [];

	// don't create empty array, component must derive own version if required
	public static _observedAttributes: string[] = ['Base'];
	public static get observedAttributes(): string[] {
		log.info(`get ${this.constructor.name}.observedAttributes() called`);
		log.dump(this._observedAttributes, 'this._observedAttributes');
		log.dump((this.constructor as any)._observedAttributes, '(this.constructor as any)._observedAttributes');
		return this._observedAttributes;
	}

	// template html (one per component shared among all component instances)
	protected static _templateHtml: string = "";
	public get TemplateHtml(): string {
		return (this.constructor as any)._templateHtml;
	}

	public set TemplateHtml(value: string) {
		(this.constructor as any)._templateHtml = value;
	}

	// non-static properties
	protected _shadRoot: ShadowRoot;
	public get ShadRoot(): ShadowRoot { return this._shadRoot }
	public set ShadRoot(value) { this._shadRoot = value }

	// ctor
	constructor(/*tagName: string*/) {
		super();	// call HTMLElement ctor
		log.func(`${this.constructor.name} ctor() called`);

		// attach shadow element so we can find out who our parent is
		this._shadRoot = this.attachShadow({ mode: 'open' });
		assert(this._shadRoot != null, `attachShadow() failed from component ${this.constructor.name}}`);

		// get host parent node (from light dom) of this shadow dom node
		// Note that the following code doesn't work (returns undefined)
		//let root = this.getRootNode() as ShadowRoot;
		//let parent = root.host;
		let host = this.ShadRoot.host;
		assert(host != undefined, `host element doesn't exist for component ${this.constructor.name}}`);

		// get parent of host
		let parent = host.parentElement;
		let parentKey = 'main';
		if (parent != undefined) {
			let parentId = parent?.id;
			parentKey = (parentId == undefined || parentId == "") ? parent.tagName.toLowerCase() : `#${parentId}`;
		}
		let component: IComponent = { slug: '/', tag: this.TagName, parent: parentKey, instance: this };

		BaseComponent.Router.addComponent(component);

		let parser: TemplateParser  = new TemplateParser(this);
		parser.cloneAndAttachTemplate(false);
	}

	//public getFunctionByNameKey<K extends keyof this>(key: K): EventListener {
	//	return this[key] as unknown as EventListener;
	//}

	public getFunctionByName(funcName: string): EventListener {
		let funcKey = funcName as keyof this;
		let fn = this[funcKey];
		if (fn == undefined) {
			log.error(`Function '${funcName}' specified within html template for component '${this.constructor.name}' does not exist. Have you forgotten to add it to the component class?`);
		}
		return fn as unknown as EventListener;
	}

	private getNestedValue(path: string): any {
		let obj = this;
		if (path.startsWith('this.'))
			path = path.slice(5);
		let value = path.split('.').reduce((obj: any, key: keyof any) => obj?.[key], obj);
		return value;
	}

	public GetPropValue(propName: string): string { //this[keyof this] {
		// top level class members will be fieldName or propName
		// need to also find nested props such as this.dto.forename
		let propValue: any = undefined;
		if (propName.indexOf('.') >= 0) {
			// nested property ref
			propValue = this.getNestedValue(propName);
			log.debug(`nested propName=${propName}, nested propVal=${propValue}`);
			if (propValue === undefined)
				log.error(`Could not find nested property '${propName}'`);
		}
		else {
			// non-nested prop
			let propKey = propName as keyof this;
			if (propKey in this)
				propValue = this[propKey];
			else
				log.error(`HTML Template Error: Property/field '${propKey}' does not exist in ${this.constructor.name}. You need to declare this in ${this.constructor.name}.ts as well as adding the necessary decorator (@PropOut or @Attrib)`);
		}

		return (propValue === undefined) ? `{{?${propName}?}}` : propValue;
	}

	public getDataAttribWco(propName: keyof this): string {
		return `data-wco-${propName}`;
	}

	public getDataAttribWci(propName: keyof this): string {
		return `data-wci-${propName}`;
	}

	public getDataAttribWce(propName: string): string {
		return `data-wce-${propName}`;
	}

	public getDataAttribWct(): string {
		return `data-wci-${this.TagName}`;
	}

	public getShadowElementsByAttribName<T extends HTMLElement>(attribName: string): NodeListOf<T> {
		let shad = this.shadowRoot;
		if (shad == null) {
			log.error('GetShadowElement(): this.shadowRoot is null');
			return {} as NodeListOf<T>;
		}

		// nested path attribute names contain '.' char, this needs to be escaped with \\
		attribName = attribName.replace(/\./g, '\\.');
		let elems = shad.querySelectorAll<T>(`[${attribName}]`);
		if (elems == null) {
			log.error(`GetShadowElement(): element with attribute ${attribName} not found`);
			return {} as NodeListOf<T>;
		}

		return elems;
	}

	public addNestedOutputField(fullPathFieldName: string) {
		assert(fullPathFieldName.indexOf('.') >= 0, "This should only be used for tracking output fields with nested paths");
		this._knownOutputFields.push(fullPathFieldName);
		log.highlight(`Adding output field '${fullPathFieldName}' to array _knownOutputFields`);
	}

	private getKnownOutputField(partialPath: keyof this): string[] {
		let matches = this._knownOutputFields.filter((field) => field.startsWith(partialPath + '.'));
		return matches;
	}

	// called for hierarchical nested object structures to ensure any relevant child properties have their HTML output fields updated
	public UpdateChildElementsContent(propName: keyof this) {
		//let path = 'propName';
		const rootObject: this[keyof this] = this[propName];		// e.g. this.dto
		assert(typeof rootObject === 'object', 'UpdateChildElementsContent(): This function should only be called for objects');
		let dependentFields = this.getKnownOutputField(propName);
		for (let field of dependentFields) {
			log.highlight(`updating dep field=${field}`);
			this.SetElementContent(field as keyof this);
		}

		//for (let fieldName in rootObject) {
		//	let fullPathFieldName = `${path}${fieldName}`;
		//	if (this.isKnownOutputField(fullPathFieldName))
		//		this.SetElementContent(fullPathFieldName as keyof this);
		//}
	}

	public SetElementContent(propName: keyof this) {
		// Return silently if template not yet processed - can't update DOM element if it doesn't exist yet.
		// Static initialisers cause this to happen, it's a non-issue since connectedCallback() will also cause output fields/props to update
		if (this.TemplateHtml == "") {
			//log.info('SetElementContent(): TemplateHtml is null, deferring call until connectedCallback()');
			return;
		}

		let attribName = this.getDataAttribWco(propName);
		let propValue = this.GetPropValue(propName as string) as string;

		let elems = this.getShadowElementsByAttribName(attribName);
		if (elems == null || elems.length === 0)
			log.error(`SetElementContent(): Could not find element with attribute '${attribName}' inside component ${this.constructor.name}`);
		else {
			for (let el of elems)
				el.innerHTML = propValue;
		}
	}

	// DOM custom element loaded event
	protected async connectedCallback() {
		log.event(`${this.constructor.name}.connectedCallback() called`);

		// if this component has already been initialised, then do nothing
		if (this.TemplateHtml != "") {
			log.info(`Component ${this.TagName} template is already initialised, exiting connectedCallback`);
			return;
		}

		if (!customElements.whenDefined(this.TagName)) {
			log.error(`${this.TagName} is not [yet?] registered, have you called customElements.define('${this.TagName}', '${this.constructor.name}') in the app.ts file?`);
			return;
		}

		// connectedCallback and all descendents must be awaited otherwise intialisation/binding will fail
		log.info(`Component ${this.TagName} NOT initialised, awaiting html template load/parse...`);
		let parser: TemplateParser = new TemplateParser(this);
		await parser.loadAndParseTemplate();
	}

	// DOM element unloaded event
	protected async disconnectedCallback() {
		// call removeEventListener for every event in html
		log.event(`${this.constructor.name}.disconnectedCallback() called`);
	}

	protected async attributeChangedCallback(
		custAttrName: keyof this,
		oldVal: this[keyof this],
		newVal: this[keyof this])
	{
		log.event(`attributeChangedCallback(): Attribute name : ${custAttrName}, old value: ${oldVal}, new value: ${newVal}`);
	}

	// not currently used by this class
	protected async adoptedCallback() {
		log.event(`{this.constructor.name}.adoptedCallback(): called`);
		log.error('Unxpected call to BaseComponent.adoptedCallback()');
	}

	public loadComponent(tag: string, parent: string, slug: string, setState: boolean = true) {
		let route: IRoute = { slug, tag, parent };
		BaseComponent.Router.loadComponent(route, setState);
	}

	//setProp<K extends keyof this>(propName: K, propValue: this[K]) {
	//	this[propName] = propValue;
	//}

	//getProp<K extends keyof this>(propName: K): this[K] {
	//	return this[propName];
	//}
}
