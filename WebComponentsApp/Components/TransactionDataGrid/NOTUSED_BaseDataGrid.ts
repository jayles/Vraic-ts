//import { BaseComponent } from 'vraic-lib';
//import { Component, Attrib } from 'vraic-lib';
//import { log } from 'vraic-lib';
//import Transaction from './Transaction.js';

////@Component('data-grid')
//export default class BaseDataGrid<T> extends BaseComponent {
//	public DataUri: string = '';
//	public DataContent: Nullable<Array<T>> = null;

//	constructor() {
//		super();
//	}

//	// note this will be called every time this component is inserted/reinserted into the DOM
//	protected async connectedCallback()
//	{
//		log.event('sub: BaseDataGrid<T>.connectedCallback() called');

//		// call base class and wait till complete
//		await super.connectedCallback();

//		// if we don't yet have any data, then fetch it
//		if ((this.DataContent === null) && (this.DataUri !== ''))
//		{
//			let response = await fetch(this.DataUri);
//			let json = await response.text();
//			if (json == null)
//				return;

//			// deserialize json into Array<T> container
//			this.DataContent = JSON.parse(json);
//		}

//		// render the table
//		this.CreateTableHtml();

//		log.info('sub: BaseDataGrid<T>.connectedCallback() base class completed');
//	}

//	private GetHeaderRow(): string
//	{
//		let firstRow: Nullish<T> = this.DataContent?.[0];
//		if (firstRow == null)
//			return '';

//		let headers = '<tr>';
//		// see https://github.com/microsoft/TypeScript/issues/3500
//		for (let key in firstRow)
//			headers += `<th align="left">${key}</th>`;
//		return headers + '</tr>';
//	}

//	private GetFormattedValue(keyName: string, keyValue: T[keyof T]): string
//	{
//		let outValue: string = '';
//		switch (typeof keyValue)
//		{
//			case 'object':
//				if (keyValue instanceof Date)
//					outValue = keyValue.toLocaleDateString('en-GB');
//				break;

//			case 'number':
//				outValue = keyValue.toFixed(2);
//				if (keyName.endsWith('Currency'))
//					outValue = '£' + outValue;
//				break;

//			case 'boolean':
//				outValue = keyValue.toString();
//				break;

//			case 'string':
//				outValue = keyValue;
//				break;

//			default:
//				throw new Error(`Unexpected data type encountered in BaseDataGrid<T>.GetFormattedValue(keyName=${keyName}, keyValue=${keyValue}, dataType=${typeof keyValue})`);
//		}

//		// return formatted string
//		return outValue;
//	}

//	// `<td>${propName}</td>`;
//	private GetDataRow(transaction: T): string
//	{
//		let row = '<tr>';
//		let key: keyof T;
//		for (key in transaction)
//		{
//			let output = this.GetFormattedValue(key as string, transaction[key]);
//			row += `<td>${output}</td>`;
//		}
//		return row + '</tr>';
//	}

//	private GetDataRows(): string
//	{
//		if (this.DataContent == null)
//			return '';

//		let rows = '';
//		for (let row of this.DataContent)
//			rows += this.GetDataRow(row);

//		return rows;
//	}

//	private CreateTableHtml(): void
//	{
//		this.ShadRoot.innerHTML =
//			`<table>
//				<thead>${this.GetHeaderRow()}</thead>
//				<tbody>${this.GetDataRows()}</tbody>
//			</table>`;
//	}
//}
