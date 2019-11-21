var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BaseComponent from '../BaseComponent.js';
import Person from './Person.js';
export default class MyInputForm extends BaseComponent {
    constructor(htmlTag) {
        super(htmlTag);
        this.dto = new Person();
        this.dto.forename = 'John';
        this.dto.surname = 'Smith';
        this.dto.dob = new Date('1995-12-31T23:59:59');
        this.dto.age = 88;
        this.dto.alive = true;
        console.log('MyInputForm ctor(...) called');
        console.log(`dto = ${this.dto}`);
    }
    connectedCallback() {
        const _super = Object.create(null, {
            connectedCallback: { get: () => super.connectedCallback }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.connectedCallback.call(this);
            console.log('MyInputForm.connectedCallback() called');
            this.copyDtoToFormA(this.dto);
        });
    }
    onSubmit() {
        console.log('MyInputForm.onSubmit() called');
        let person = new Person();
        this.dto = this.copyFormToDtoA(person);
        console.log(this.dto);
    }
    copyFormToDtoA(idto) {
        const odto = {};
        const ownKeys = Reflect.ownKeys(idto);
        for (const propName of ownKeys) {
            let elId = `wci-${propName}`;
            let inputEl = this.GetShadowElement(elId);
            if (inputEl == null) {
                alert(`Input element ${inputEl} not found in input form`);
                continue;
            }
            let propKey = propName;
            let propValue = idto[propKey];
            let typeName = typeof propValue;
            switch (typeName) {
                case 'string':
                    odto[propName] = inputEl.value;
                    break;
                case 'number':
                    odto[propName] = inputEl.valueAsNumber;
                    break;
                case 'object':
                    if (propValue instanceof Date)
                        odto[propName] = inputEl.valueAsDate;
                    else
                        alert('copyDtoToFormA() - non-Date object encountered');
                    break;
                case 'boolean':
                    odto[propName] = inputEl.checked;
                    break;
                default:
                    alert(`copyDtoToFormA() - hit default in switch, type was '${typeName}'`);
            }
        }
        return odto;
    }
    copyDtoToFormA(dto) {
        const ownKeys = Reflect.ownKeys(dto);
        for (const propName of ownKeys) {
            let elId = `wci-${propName}`;
            let inputEl = this.GetShadowElement(elId);
            if (inputEl == null) {
                alert(`Input element ${inputEl} not found in input form`);
                continue;
            }
            let propValue = dto[propName];
            let type = typeof propValue;
            switch (typeof propValue) {
                case 'string':
                    inputEl.value = propValue;
                    break;
                case 'number':
                    inputEl.valueAsNumber = propValue;
                    break;
                case 'object':
                    if (propValue instanceof Date)
                        inputEl.valueAsDate = propValue;
                    else
                        alert('copyDtoToFormA() - non-Date object encountered');
                    break;
                case 'boolean':
                    inputEl.checked = propValue;
                    break;
                default:
                    alert(`copyDtoToFormA() - hit default in switch, type was '${type}'`);
            }
        }
    }
}
//# sourceMappingURL=MyInputForm.js.map