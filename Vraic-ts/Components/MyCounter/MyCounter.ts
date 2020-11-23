import BaseComponent from '../../../VraicLib/lib/BaseComponent';
import { Component, Attrib, Output } from '../../../VraicLib/lib/Decorators';
//import { log } from '../../../VraicLib/lib/Logger';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component, Output } from '../../Vraic/Decorators.js';

@Component('my-counter')
export default class MyCounter extends BaseComponent {

	@Output public count: number = 345;

	constructor() {
		super();
	}
}
