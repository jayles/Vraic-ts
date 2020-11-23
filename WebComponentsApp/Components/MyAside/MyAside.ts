import { BaseComponent } from '../../node_modules/vraic-lib/index.js';
import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';

//import { BaseComponent } from 'vraic-lib';
//import { Component, Attrib } from 'vraic-lib';
//import { log } from 'vraic-lib';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component } from '../../Vraic/Decorators.js';

@Component('my-aside')
export default class MyAside extends BaseComponent {
	constructor() {
		super();
	}
}
