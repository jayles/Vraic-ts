import { BaseComponent, BaseInputForm } from '../../node_modules/vraic-lib/index.js';
import { Component, Attrib, Output } from '../../node_modules/vraic-lib/index.js';
import { log } from '../../node_modules/vraic-lib/index.js';
import Person from './Person.js';

//import BaseComponent from 'vraic-lib';
//import { Component, Attrib, Output } from 'vraic-lib';
//import { log } from 'vraic-lib';
//import { BaseInputForm } from 'vraic-lib';
//import Person from './Person';

//import BaseInputForm from '../../Vraic/BaseInputForm.js';
//import Person from './Person.js';
//import { Component, Output } from '../../Vraic/Decorators.js';
//import { log } from '../../Vraic/Logger.js';

@Component('person-form')
export default class PersonForm extends BaseInputForm<Person> {

	// input form DTO is declared in base class BaseInputForm<T>
	@Output public dto: Person = new Person();

	//@PropOut3 forename: string = 'forename';
	//@PropOut3 surname: string = 'surname';
	@Output alive: boolean = true;

	@Output test: string = "Some data";

	// ctor
	constructor() {
		super();

		this.dto = new Person();
		log.func('PersonForm.ctor() called');
		log.info('this.dto was initialised with these values:');
		log.debug(this.dto);
	}

	protected onSubmit() {
		super.onSubmit();
		log.func('PersonForm.onSubmit() called, dto has now been updated');
		log.info('this.dto updated values are:');
		log.debug(this.dto);
	}
}
