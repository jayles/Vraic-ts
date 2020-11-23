import BaseComponent from '../../../VraicLib/lib/BaseComponent';
import { Component, Attrib } from '../../../VraicLib/lib/Decorators';
//import { log } from '../../../VraicLib/lib/Logger';

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
