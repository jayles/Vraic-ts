import BaseComponent from '../../Vraic/BaseComponent.js';
import { Component } from '../../Vraic/Decorators.js';
//import { log } from '../BaseComponent/Logger.js';

@Component('my-aside')
export default class MyAside extends BaseComponent {
	constructor() {
		super();
	}
}
