import { BaseComponent } from '../../node_modules/vraic-lib/index.js';
import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';
import { log } from '../../node_modules/vraic-lib/index.js';
import Transaction from './Transaction.js';

//import { BaseComponent } from 'vraic-lib';
//import { Component, Attrib } from 'vraic-lib';
//import { log } from 'vraic-lib';

//import BaseComponent from '../../Vraic/BaseComponent.js';
//import { Component } from '../../Vraic/Decorators.js';
//import { log } from '../../Vraic/Logger.js';
//import '../MyTime/MyTime.js';	// use unnamed import to ensure MyTime loaded

@Component('data-grid')
export default class DataGrid extends BaseComponent {
	public DataUri: string;
	private DataContent: Nullable<Array<Transaction>> = null;
	//private createTableFrameId: number = -1;

	constructor() {
		super();

		this.DataUri = "/Components/TestData/Transactions.json";
	}

	protected async connectedCallback()
	{
		// note this will be called every time this component is inserted/reinserted into the DOM
		log.event('sub: HtmlPage.connectedCallback() called');

		// call base class and wait till complete
		await super.connectedCallback();

		// if we don't yet have any data, then fetch it
		if (this.DataContent === null)
		{
			let response = await fetch(this.DataUri);
			let json = await response.text();
			if (json == null)
				return;

			// deserialize json into Array<T> container
			this.DataContent = JSON.parse(json);
		}

		// render the table
		this.CreateTableHtml();

		log.info('sub: DataGrid.connectedCallback() base class completed');
	}

	private GetHeaderRow(): string
	{
		if (this.DataContent === null)
			return '';

		let firstRow: Transaction = this.DataContent[0];
		if (firstRow === null)
			return '';

		let headers = '<tr>';
		// see https://github.com/microsoft/TypeScript/issues/3500
		for (let key in firstRow)
			headers += `<th align="left">${key}</th>`;
		return headers + '</tr>';
	}

	// `<td>${propName}</td>`;
	private GetDataRow(transaction: Transaction): string
	{
		let row = '<tr>';
		let key: keyof Transaction;
		for (key in transaction) {
			let value = transaction[key];

			// format props ending with Date as dates
			if (key.endsWith('Date')) {
				let dt:Date = new Date(Date.parse(value as string));
				value = dt.toLocaleDateString('en-GB');
			}

			// format props ending with Currency as currency
			if (key.endsWith('Currency')) {
				let nm: number = (value as number);
				value = '£' + nm.toFixed(2);
			}

			row += `<td>${value}</td>`;
		}

		return row + '</tr>';
	}

	private GetDataRows(): string
	{
		if (this.DataContent === null)
			return '';

		let rows = '';
		for (let transaction of this.DataContent)
			rows += this.GetDataRow(transaction);

		return rows;
	}

	private CreateTableHtml(): void
	{
		// use the render cycle
		//if (this.createTableFrameId != -1)
		//	cancelAnimationFrame(this.createTableFrameId);
		//this.createTableFrameId = requestAnimationFrame(() =>
		//{
			//<thead>
			//	<tr>${this.DataContent.reduce((html, col, i) => { return html + `<th>${i + 1} ${col}</th>`; }, '')}</tr>
			//</thead>

			//<tbody>
			//	<tr>${this.DataContent.map((row, i) => { return `<td>${row.join('</td><td>')}</td>`; }).join('</tr><tr>')}</tr>
			//</tbody>

			this.ShadRoot.innerHTML =
				`<table>
					<thead>${this.GetHeaderRow()}</thead>
					<tbody>${this.GetDataRows()}</tbody>
				</table>`;
		//});
	}
}
