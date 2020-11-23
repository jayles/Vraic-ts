﻿import BaseComponent from './BaseComponent.js';
import { Freeze } from './Decorators.js';
import { log, assert } from './Logger.js';

export interface IComponent {
	slug: string;						// slug
	tag: string;						// component tag
	parent: string;					// DOM element
	instance: Nullable<BaseComponent>;	// class ref (if instantiated)
}

// a route is the just a component without a specified component instance
export type IRoute = Omit<IComponent, 'instance'>;

@Freeze
export class Router {

	// fields
	public Slug: string = '';
	public DefaultTag: string = '';
	public DefaultParent: string = '';

	private _components: Array<IComponent>;
	//private routes: Map<string, IComponent> = new Map<string, IComponent>();

	// ctor
	constructor() {
		this.DefaultTag = 'html-page';
		this.DefaultParent = 'main';

		// these routes are only required for non-prerendered SPA sites that rely on 404 errors redirecting to index.html page
		// when this happens, we need to present the correct page state for whatever url has been entered into the browser
		// For statically-rendered sites, a 404 is a real 404, so we don't need this lookup table
		this._components = [
			{ slug: '/',				tag: 'my-content',	parent: 'main', instance: null },
			{ slug: 'counter',	tag: 'my-counter',	parent: 'main', instance: null },
			{ slug: 'input',		tag: 'person-form', parent: 'main', instance: null },
			//{ slug: 'news',			tag: 'html-page',		parent: 'main', instance: null },
			{ slug: '*',				tag: 'html-page',		parent: 'main', instance: null },
		];

		// one url event handler for all components
		window.addEventListener('locationchange', this.onUrlChanged.bind(this));
		window.addEventListener('popstate', this.onPopstate.bind(this));
		window.addEventListener('pushstate', this.onPushstate.bind(this));
		let slug = window.location.pathname;
		this.Slug = (slug === '/') ? '/' : slug.slice(1);
		log.info(`Router initialised, slug=${this.Slug}`);
	}

	public findRoute(slug: string): IRoute {
		let comp: IComponent|undefined = this._components.find(c => c.slug === slug);
		if (comp == null) {
			// not found, so look for default route '*'
			comp = this._components.find(c => c.slug === '*');
			assert(comp != null, 'Oh no!');
		}
		let route: IRoute = { slug: comp.slug, tag: comp.tag, parent: comp.parent };
		log.dump(route, `findRoute(): Route found was : `);
		return route;
	}

	private componentExists(target: IRoute): IComponent {
		let comps = this._components.filter(c => c.tag === target.tag && c.parent === target.parent);
		assert(comps?.length >= 0 && comps?.length <= 1, `componentExists(), comps=${comps.length}`);
		return comps?.[0];
	}

	public addComponent(newComponent: IComponent) {
		// store component info in map so we can retrieve it later
		let tagName = newComponent.tag;
		log.info(`Looking for existing html component '${tagName}'`);
		let existingComponent = this.componentExists(newComponent);
		if (existingComponent == null) {
			log.info(`Html component ${tagName} not found, adding to array`);
			this._components.push(newComponent);
		}
		else {
			// in route map, but not yet created, so instance will be null
			assert(existingComponent.instance == null, 'Request to create component that already exists in map with non-null instance??? 404 perhaps?');
			log.info(`Html component ${tagName} already exists, updating instance ref`);
			existingComponent.instance = newComponent.instance;
			return;
		}
	}

	// load specified web component into target html tag and set slug to specfied value
	public async loadComponent(route: IRoute, setState: boolean = true) {
		let tag = route.tag;
		let componentToInsert: BaseComponent;
		if (route.slug === '*')
			route.slug = this.Slug;

		log.func(`${this.constructor.name}.loadComponent(): Attempting to load component ${route.tag} into element <${route.parent}> and then set url to /${route.slug}`);

		// see if this component has already been created
		let component = this.componentExists(route);
		let componentExists = (component != null) && (component.instance != null);
		if (!componentExists) {
			// not found, create new instance of component

			// in case this component hasn't been registered, attempt a dynamic import
			let className = BaseComponent.getClassName(route.tag);
			let componentPath = `/Components/${className}/${className}.js`;
			try {
				//type ModuleType = ReturnType<typeof module>;
				let module = await import(componentPath);
				log.info(`Successfully loaded class '${module.default.name}' from path ${componentPath}`);
			}
			catch (error) {
				log.exception(error);
				log.error(`Unable to load component '${route.tag}' from path ${componentPath}`);
			}

			let compClassCtor = window.customElements.get(route.tag);
			if (compClassCtor === undefined) {
				log.error(`${tag} is not [yet?] registered, have you imported it either in the app.ts file, or using an import statment in the parent component (if nested)?`);
				return;
			}
			//let className = compClassCtor.constructor.name;
			log.info(`Creating new component '${route.tag}'`);
			componentToInsert = new compClassCtor();
		}
		else {
			// found in routes list, re-use old component if found
			log.info(`Found existing component ${tag}`);
			assert(component.instance != null, `Router.loadComponent(): Found component '${component.tag}', but instance is null`);
			componentToInsert = component.instance;
		}

		// get ref to target HTML element container
		let targetElement = route.parent;
		let parentNode = document.querySelector<HTMLElement>(targetElement);
		if (parentNode == null) {
			log.error(`loadComponent(): Could not find element ${targetElement} in current document`);
			return;
		}

		let componentToReplace = parentNode.firstChild;
		if (componentToReplace == null) {
			log.error(`Element ${targetElement} has no child element to replace`);
			return;
		}

		// update route with new url
		this.Slug = route.slug;
		log.debug(`Router slug changed, slug=${this.Slug}`);

		// update DOM with correct component, this will fire the connectedCallback() event
		parentNode.replaceChild(componentToInsert, componentToReplace);

		// scan DOM to see if we have any unknown elements (indicates custom component loading failure)
		this.checkForFailedComponents();

		// handle url changed events (don't do this if user clicked Back/Forwards buttons)
		if (setState) {
			log.info(`Calling history.pushstate(${JSON.stringify(route)})`);
			history.pushState(route, 'title', route.slug);
		}
	}

	private checkForFailedComponents() {
		log.highlight('Entered checkForFailedComponents()');
		// scan entire light DOM looking for HTMLUnknownElement
		let lightElement = document.querySelectorAll('body *');
		for (let el of lightElement) {
			if (el instanceof HTMLElement)
				log.info(`Found HTMLElement, tag is : ${(el as HTMLElement).tagName}`);
			if (el instanceof HTMLUnknownElement)
				log.highlight(`Found HTMLUnknownElement, tag is : ${(el as HTMLUnknownElement).tagName}`);
			if (el instanceof HTMLInputElement)
				log.error(`Found HTMLInputElement, tag is : ${(el as HTMLInputElement).tagName}`);
		}
	}

	//
	// url changed events
	//

	// Back/Forwards browser buttons
	protected onPopstate(ev: PopStateEvent) {
		log.event('Router.onPopstate() called');

		let route: IRoute = ev.state;
		if (route == null) {
			log.warn('onPopstate(), pushstate is null, cannot go backwards any further');
			return;
		}

		// log route to console and load specified component into dom
		log.debug(route);
		this.loadComponent(route, false);	// false = don't push state after user has clicked backwards/forwards buttons
	}

	// never called
	protected onUrlChanged(ev: Event) {
		log.event('Router.onUrlChanged() called');
		log.debug(ev);
		log.error('unexpected call to onUrlChanged()');
	}

	// Note - not triggered by calling history.pushState(), hence never called
	protected onPushstate(ev: Event) {
		log.event('Router.onPushstate() called');
		log.debug(ev);
		log.error('unexpected call to onPushstate()');
	}

}