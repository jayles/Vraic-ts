import BaseComponent from './BaseComponent.js';
export default class BaseInputForm<T extends object> extends BaseComponent {
    static tag: string;
    dto: T;
    constructor();
    protected connectedCallback(): Promise<void>;
    protected onSubmit(): void;
    protected copyFormToDtoA<T extends object>(idto: T): T;
    protected copyDtoToFormA<T extends object>(dto: T): void;
}
