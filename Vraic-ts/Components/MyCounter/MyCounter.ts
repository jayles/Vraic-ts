import BaseComponent from '../../Vraic/BaseComponent.js';
import { Component, Output } from '../../Vraic/Decorators.js';
//import { log } from '../BaseComponent/Logger.js';

@Component('my-counter')
export default class MyCounter extends BaseComponent {

	@Output public count: number = 345;

	constructor() {
		super();
	}
}
