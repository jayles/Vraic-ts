import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';
import BaseDataGrid from '../../node_modules/vraic-lib/BaseDataGrid.js';
//import { log } from '../../node_modules/vraic-lib/index.js';

import Transaction from './Transaction.js';

@Component('transaction-data-grid')
export default class TransactionDataGrid extends BaseDataGrid<Transaction> {

	constructor() {
		super();

		this.DataUri = "/Components/TestData/Transactions.json";
	}

	// note this will be called every time this component is inserted/reinserted into the DOM
	protected async connectedCallback()
	{
		// call base class and wait till complete
		await super.connectedCallback();
	}
}
