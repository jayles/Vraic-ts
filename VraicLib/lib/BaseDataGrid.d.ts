import BaseComponent from './BaseComponent.js';
export default class BaseDataGrid<T extends object> extends BaseComponent {
    static tag: string;
    DataUri: string;
    DataContent: Nullable<Array<T>>;
    constructor();
    protected dateReviver(key: any, value: any): any;
    protected connectedCallback(): Promise<void>;
    private GetHeaderRow;
    private GetFormattedValue;
    private GetDataRow;
    private GetDataRows;
    private CreateTableHtml;
}
