//import { BaseComponent } from 'vraic-lib';
import { BaseComponent } from '../../node_modules/vraic-lib/index.js';

import { Component, Attrib } from '../../node_modules/vraic-lib/index.js';
import { log } from '../../node_modules/vraic-lib/index.js';

//import CheckListItem from './CheckListItem.js';

// based on https://stackoverflow.com/questions/19206919/how-to-create-checkbox-inside-dropdown

@Component('dropdown-checklist')
export default class DropDownCheckList extends BaseComponent
{
	// fields
	private dropdownAnchor: Nullable<HTMLElement>;

	// ctor
	constructor() {
		super();

		this.dropdownAnchor = this.ShadRoot.getElementById('');
	}

	// note this will be called every time this component is inserted/reinserted into the DOM
	protected async connectedCallback()
	{
		// call base class and wait till complete
		await super.connectedCallback();
	}

	public ToggleVisibility(dropId: string)
	{
		let dropEl = this.ShadRoot.getElementById(dropId);
		if (dropEl == null)
			return;

		if (dropEl.classList.contains('visible')) {
			dropEl.classList.remove('visible');
			dropEl.style.display = 'none';
		}
		else {
			dropEl.classList.add('visible');
			dropEl.style.display = 'block';
		}
	}

	public ToggleCheckBox(sender: HTMLElement) {
		log.info(`dropdown checkbox item changed, name=${sender.id}`);
	}

}
