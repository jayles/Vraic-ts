import BaseComponent from '../../../VraicLib/lib/BaseComponent';
import { Component, Attrib } from '../../../VraicLib/lib/Decorators';
//import { log } from '../../../VraicLib/lib/Logger';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component } from '../../Vraic/Decorators.js';

@Component('my-aside')
export default class MyAside extends BaseComponent {
	constructor() {
		super();
	}
}
