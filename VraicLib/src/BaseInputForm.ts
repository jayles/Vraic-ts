import BaseComponent from './BaseComponent.js';
import { Freeze } from './Decorators.js';
import { log, assert } from './Logger.js';

@Freeze
export default class BaseInputForm<T extends object> extends BaseComponent {
	public static tag: string = "BaseInputForm (not used)";	// Not used by this class, but derived copy used by subclasses

	// derived class must create the concrete object
	public dto!: T;

	constructor() {
		super();

		log.func(`BaseInputForm<T> (${this.constructor.name}) ctor called`);
	}

	protected async connectedCallback()
	{
		await super.connectedCallback();

		// set up DTO
		log.event(`${this.constructor.name}.connectedCallback() called`);

		// create HTML elements for form
		this.CreateFormHtml();

		// copy DTO to HTML input form
		this.copyDtoToFormA<T>(this.dto);
	}

	protected onSubmit() {
		log.event(`${this.constructor.name}.onSubmit() called`);

		// copy input form fields to DTO
		this.dto = this.copyFormToDtoA<T>(this.dto);

		// log dto value
		log.dump(this.dto);
	}

	protected copyFormToDtoA<T extends object>(idto: T): T {

		const odto = {} as T;

		//const ownKeys = Reflect.ownKeys(idto) as PropName<T>[];
		const ownKeys = Reflect.ownKeys(idto) as (keyof T)[];
		for (const propName of ownKeys) {
			let propKey = propName as PropName<T>;
			let propValue = idto[propKey];

			//let elId = `wci-${propName}`;
			let attribName = this.getDataAttribWci(propName as keyof this);
			let inputEls = this.getShadowElementsByAttribName<HTMLInputElement>(attribName);
			assert(inputEls.length === 1, `copyFormToDtoA(): Expected to find single <input> element, actually found ${inputEls.length} elements`);
			log.debug(`prop = ${propName}, dataAttrib = ${attribName}, ${inputEls.length}`);
			let inputEl = inputEls[0];

			// Note the difference runtime and compile time typeof usage:
			// see https://stackoverflow.com/questions/51528780/typescript-check-typeof-against-custom-type
			let typeName: string = typeof propValue;		// run-time type as value/string
			//type TPropValue = typeof propValue;				// compile time type

			switch (typeName/*typeof ldto[propName]*/) {
				case 'string': (odto[propName] as any) = inputEl.value;
					break;

				case 'number': (odto[propName] as any) = inputEl.valueAsNumber;
					break;

				case 'object':
					if (propValue instanceof Date)
						(odto[propName] as any) = inputEl.valueAsDate;
					else
						log.error('copyDtoToFormA() - non-Date object encountered');
					break;

				case 'boolean':
					let boolVal: boolean = (inputEl.value === 'true' && inputEl.checked) || (inputEl.value === 'false' && !inputEl.checked);
					(odto[propName] as any) = boolVal;
					break;

				default:
					log.error(`copyDtoToFormA() - hit default in switch, type was '${typeName}'`);
			}

		}

		return odto as T;
	}

	// There are some typing issues when enumerating/using indexers with generics in TypeScript.
	// This code for enumerating generic types was suggested by Anders Hejlsberg
	// see May 31st comment here:
	//	https://github.com/microsoft/TypeScript/issues/31661
	//
	protected copyDtoToFormA<T extends object>(dto: T) {
		const ownKeys = Reflect.ownKeys(dto) as (keyof T)[];
		for (const propName of ownKeys) {
			//let elId = `wci-${propName}`;
			//let inputEl: Nullable<HTMLInputElement> = this.GetShadowElementById<HTMLInputElement>(elId);
			let attribName = this.getDataAttribWci(propName as keyof this);
			let inputEls = this.getShadowElementsByAttribName<HTMLInputElement>(attribName);
			if (inputEls.length == undefined)
				continue;
			assert(inputEls.length === 1, `copyDtoToFormA(): Expected to find single <input> element, actually found ${inputEls.length} elements`);
			log.debug(`prop = ${propName}, dataAttrib = ${attribName}, ${inputEls.length}`);
			let inputEl = inputEls[0];

			let propValue = dto[propName];
			let type = typeof propValue;
			switch (typeof propValue) {
				case 'string': inputEl.value = propValue;
					break;

				case 'number': inputEl.valueAsNumber = propValue;
					break;

				case 'object':
					if (propValue instanceof Date)
						inputEl.valueAsDate = propValue;
					else
						log.error('copyDtoToFormA() - non-Date object encountered');
					break;

				case 'boolean':
					// for boolean there will be two radio buttons with values true and false
					// if first radio returns true, then propValue is used as is
					// if first radio returns true, then propValue logic is inverted
					let firstRadioTrue: boolean = (inputEl.value === 'true');
					inputEl.checked = firstRadioTrue ? propValue : !propValue;
					break;

				default:
					log.error(`copyDtoToFormA() - hit default in switch, type was '${type}'`);
			}
		}
	}

	private GetDataType(propName: string, propValue: PropValue<T>): string
	{
		switch (typeof propValue) {
			case 'string': return 'text';
			case 'number': return 'number';

			case 'object':
				if (propValue instanceof Date)
					return 'date';
				else {
					log.error('copyDtoToFormA() - non-Date object encountered');
					return 'error';
				}

			case 'boolean': return 'checkbox';

			default:
				log.error(`copyDtoToFormA() - hit default in switch, type was '${typeof propValue}'`);
				return 'error';
		}

	}

	// <li>
	//	<label for="first-name">First Name</label>
	//	<input type="text" id="first-name" placeholder="Enter your first name here">
	// </li>
	private GetFormFields(): string {
		let fieldHtml: string = '';

		let propKey: keyof T;
		for (propKey in this.dto)
		{
			let propName = propKey as string;
			let propValue = this.dto[propKey];
			let propType = this.GetDataType(propName, propValue);
			let propDataAttribute = this.getDataAttribWci(propName as keyof this);
			fieldHtml += `<label for="${propName}">${propName}</label><input type="${propType}" name="${propName}" placeholder="Enter ${propName} here" ${propDataAttribute}>`;
		}

		fieldHtml += `<label></label><button type="button" onclick="() => this.onSubmit();">Submit</button>`;

		return fieldHtml;
	}

	private CreateFormHtml(): void {
		this.ShadRoot.innerHTML =
			`<link async rel="stylesheet" href="/Components/BaseInputForm/BaseInputForm.css">
			<form class="grid-container">${this.GetFormFields()}</form>`;
	}

}
