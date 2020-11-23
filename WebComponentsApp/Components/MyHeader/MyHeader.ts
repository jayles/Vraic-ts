import { BaseComponent } from '../../node_modules/vraic-lib/index.js';
import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';

//import { BaseComponent } from 'vraic-lib';
//import { Component, Attrib } from 'vraic-lib/index.js';

//import { log } from ''vraic-lib/index.js';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component, Attrib } from '../../Vraic/Decorators.js';

@Component('my-header')
export default class MyHeader extends BaseComponent {

	// web component observed attributes (added automatically by @Attrib to MyHeader._observedAttributes[])
	//static get observedAttributes() {
	//	return ['title', 'my-cust-attrib'];
	//}

	// props
	@Attrib public title!: string;
	@Attrib public my_cust_attrib!: string;

	// ctor
	constructor() {
		super();
	}
}
