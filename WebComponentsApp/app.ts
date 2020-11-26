﻿import { BaseComponent } from './node_modules/vraic-lib/index.js';
import { log } from './node_modules/vraic-lib/Logger.js';

//import BaseComponent from './Vraic/BaseComponent.js';
//import { log } from './Vraic/Logger.js';

//async function checkComponentRegistered_OLD(tag: string) {
//	let ctor = await customElements.get(tag);
//	if (ctor == undefined) {
//		log.error(`Component registration failed for '${tag}'`);
//		log.error(`You need to either decorate your component class with @Component('${tag}') or add call customElements.define('${tag}', 'YourComponentClassName');`)
//	}
//	else {
//		log.info(`Component registration succeeded for '${tag}':`);
//		log.debug(ctor);
//	}
//}

async function checkComponentRegistered<T extends BaseComponent>(classDesc: Constructor<T>) {
	let tag = (classDesc as any).tag;	// this field is added by decorator, so TypeScript can't see it
	let ctor = await customElements.get(tag);
	if (ctor == undefined) {
		log.error(`Component registration failed for '${tag}'`);
		log.error(`You need to either decorate your component class with @Component('${tag}') or add call customElements.define('${tag}', '${classDesc.name}');`)
	}
	else {
		log.info(`Component registration succeeded for '${tag}':`);
		log.debug(ctor);
	}
}

// perhaps have something to set defaults
async function getConfig() {
	// don't look for css unless specified in component definition
	// @ts-ignore
	globalThis.Vraic.ImplicitCss = false;
}

// these are statically loaded as they all appear within the index.html page
import MyHeader from './Components/MyHeader/MyHeader.js'
checkComponentRegistered(MyHeader);

import MyFooter from './Components/MyFooter/MyFooter.js';
checkComponentRegistered(MyFooter);

import MyAside from './Components/MyAside/MyAside.js';
checkComponentRegistered(MyAside);

import MyContent from './Components/MyContent/MyContent.js';
checkComponentRegistered(MyContent);

// the following components are loaded dynamically

import DropDownCheckList from './Components/DropDownCheckList/DropDownCheckList.js';
checkComponentRegistered(DropDownCheckList);

//import HtmlPage from './Components/HtmlPage/HtmlPage.js';
//checkComponentRegistered(HtmlPage);

//import MyCounter from './Components/MyCounter/MyCounter.js';
//checkComponentRegistered(MyCounter);

//import PersonForm from './Components/PersonForm/PersonForm.js';
//checkComponentRegistered(PersonForm);

//import MyTime from './Components/MyTime/MyTime.js';
//checkComponentRegistered(MyTime);
