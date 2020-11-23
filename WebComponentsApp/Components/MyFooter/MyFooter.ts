import { BaseComponent } from '../../node_modules/vraic-lib/index.js';
import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';

//import { BaseComponent } from 'vraic-lib';
//import { Component, Attrib } from 'vraic-lib';
//import { log } from 'vraic-lib';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component } from '../../Vraic/Decorators.js';

@Component('my-footer')
export default class MyFooter extends BaseComponent {
	public copyright: string = `(c) Widget Ltd ${new Date().getFullYear()}`;
	constructor() {
		super();
	}
}
