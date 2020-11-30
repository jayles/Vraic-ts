import BaseComponent from './BaseComponent.js';
//import { Freeze } from './Decorators.js';
import { log, assert } from './Logger.js';

export default class BaseDataGrid<T extends object> extends BaseComponent {
	public static tag: string = "BaseDataGrid (not used)";	// Not used by this class, but derived copy used by subclasses

	public DataUri: string = '';
	public DataContent: Nullable<Array<T>> = null;

	constructor() {
		super();
	}

	// date reviver fn
	protected dateReviver(key: any, value: any): any
	{
		if (typeof value === 'string') {
			//let regex = /\d{4}-\d{2}-\d{2}T[0-2]\d:[0-5]\d:[0-5]\dZ/;
			//            yyyy-MM-dd      Thh:mm:ss                 [Z | +/- 00:00]
			let regex = /\d{4}-\d{2}-\d{2}T[0-2]\d:[0-5]\d:[0-5]\d([zZ]|[+\-]\d{2}:\d{2})?/
			let isMatch: boolean = regex.test(value);
			if (isMatch)
				return new Date(value);
		}

		return value;
	}

	// note this will be called every time this component is inserted/reinserted into the DOM
	protected async connectedCallback() {
		log.event('sub: BaseDataGrid<T>.connectedCallback() called');

		// call base class and wait till complete
		await super.connectedCallback();

		// if we don't yet have any data, then fetch it
		if ((this.DataContent === null) && (this.DataUri !== '')) {
			let response = await fetch(this.DataUri);
			let json = await response.text();
			if (json == null)
				return;

			// deserialize json into Array<T> container
			this.DataContent = JSON.parse(json, this.dateReviver);
		}

		// render the table
		this.CreateTableHtml();

		log.info('sub: BaseDataGrid<T>.connectedCallback() base class completed');
	}

	private GetHeaderRow(): string {
		let firstRow: Nullish<T> = this.DataContent?.[0];
		if (firstRow == null)
			return '';

		let headers = '<tr>';
		// see https://github.com/microsoft/TypeScript/issues/3500
		for (let key in firstRow)
			headers += `<th align="left">${key}</th>`;
		return headers + '</tr>';
	}

	private GetFormattedValue(keyName: string, keyValue: T[keyof T]): string {
		let outValue: string = '';
		switch (typeof keyValue) {
			case 'object':
				if (keyValue instanceof Date) {
					outValue = new Date(keyValue).toLocaleDateString('en-GB');
					//log.info(`GetFormattedValue(): formatted as (date) ${outValue}`);
				}
				break;

			case 'number':
				outValue = keyValue.toFixed(2);
				if (keyName.endsWith('Currency'))
					outValue = '&pound;' + outValue;
				//log.info(`GetFormattedValue(): formatted as (number) ${outValue}`);
				break;

			case 'boolean':
				outValue = keyValue.toString();
				//log.info(`GetFormattedValue(): formatted as (boolean) ${outValue}`);
				break;

			case 'string':
				outValue = keyValue;
				//log.info(`GetFormattedValue(): formatted as (string) ${outValue}`);
				break;

			default:
				log.error('GetFormattedValue(): hit default in switch');
				throw new Error(`Unexpected data type encountered in BaseDataGrid<T>.GetFormattedValue(keyName=${keyName}, keyValue=${keyValue}, dataType=${typeof keyValue})`);
		}

		// return formatted string
		return outValue;
	}

	// `<td>${propName}</td>`;
	private GetDataRow(transaction: T): string {
		let row = '<tr>';
		let key: keyof T;
		for (key in transaction) {
			let output = this.GetFormattedValue(key as string, transaction[key]);
			row += `<td>${output}</td>`;
		}
		return row + '</tr>';
	}

	private GetDataRows(): string {
		if (this.DataContent == null)
			return '';

		let rows = '';
		for (let row of this.DataContent)
			rows += this.GetDataRow(row);

		return rows;
	}

	private CreateTableHtml(): void {
		this.ShadRoot.innerHTML =
			`<link async rel="stylesheet" href="/Components/BaseDataGrid/BaseDataGrid.css">
			<table>
				<thead>${this.GetHeaderRow()}</thead>
				<tbody>${this.GetDataRows()}</tbody>
			</table>`;
	}
}
