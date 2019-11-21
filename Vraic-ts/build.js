var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("WebComponents/BaseComponent/Logger", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function assert(condition, msg) {
        if (!condition) {
            exports.log.error(`assert() failed : ${msg}`);
            exports.log.stack('Stack trace is:');
        }
    }
    exports.assert = assert;
    class Logger {
        constructor() {
        }
        assertionFunctionTest(str) {
            assert(typeof str === "string");
            return str.toUpperCase();
        }
        info(msg) {
            console.info(msg);
        }
        func(msg) {
            console.info(`%c ${msg}`, "color: darkorange");
        }
        event(msg) {
            console.info(`%c DOM event => ${msg}`, "color: green");
        }
        debug(msg) {
            if (typeof (msg) === 'object')
                msg = JSON.stringify(msg);
            console.info(`%c ${msg}`, "color: purple");
        }
        template(msg) {
            console.info(`%c ${msg}`, "color: blue");
        }
        warn(msg) {
            console.warn(msg);
        }
        error(msg) {
            console.error(msg);
            alert(msg);
            return msg;
        }
        highlight(msg) {
            console.info(`%c ${msg}`, 'color: black; background: yellow');
        }
        trace(msg) {
            console.trace(msg);
        }
        stack(msg) {
            console.trace(msg);
        }
    }
    exports.Logger = Logger;
    exports.log = new Logger();
    exports.log.info('Logger started...');
});
define("WebComponents/BaseComponent/Router", ["require", "exports", "WebComponents/BaseComponent/Logger"], function (require, exports, Logger_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Router {
        constructor() {
            this.Slug = '';
            this.DefaultTag = '';
            this.DefaultDiv = '';
            this.DefaultDiv = 'main';
            this.DefaultTag = 'html-page';
            this._components = [
                { slug: '/', tag: 'my-content', parent: 'main', instance: null },
                { slug: 'counter', tag: 'my-counter', parent: 'main', instance: null },
                { slug: 'input', tag: 'person-form', parent: 'main', instance: null },
                { slug: '*', tag: 'html-page', parent: 'main', instance: null }
            ];
            window.addEventListener('locationchange', this.onUrlChanged.bind(this));
            window.addEventListener('popstate', this.onPopstate.bind(this));
            window.addEventListener('pushstate', this.onPushstate.bind(this));
            this.Slug = window.location.pathname.slice(1);
            Logger_js_1.log.highlight(`Router initialised, slug=${this.Slug}`);
        }
        componentExists(target) {
            var _a, _b, _c;
            let comps = this._components.filter(c => c.tag === target.tag && c.parent === target.parent);
            Logger_js_1.assert(((_a = comps) === null || _a === void 0 ? void 0 : _a.length) >= 0 && ((_b = comps) === null || _b === void 0 ? void 0 : _b.length) <= 1, `componentExists(), comps=${comps.length}`);
            return (_c = comps) === null || _c === void 0 ? void 0 : _c[0];
        }
        addComponent(newComponent) {
            let tagName = newComponent.tag;
            Logger_js_1.log.info(`Looking for existing html component '${tagName}'`);
            let existingComponent = this.componentExists(newComponent);
            if (existingComponent == null) {
                Logger_js_1.log.info(`Html component ${tagName} not found, adding to array`);
                this._components.push(newComponent);
            }
            else {
                Logger_js_1.assert(existingComponent.instance == null, 'Eh?');
                Logger_js_1.log.info(`Html component ${tagName} already exists, updating instance ref`);
                existingComponent.instance = newComponent.instance;
                return;
            }
        }
        loadComponent(route, setState = true) {
            let tag = route.tag;
            let componentToInsert;
            Logger_js_1.log.func(`loadComponent(): Attempting to load component ${route.tag} into element <${route.parent}> and then set url to /${route.slug}`);
            let component = this.componentExists(route);
            let componentExists = (component != null) && (component.instance != null);
            if (!componentExists) {
                let compClassCtor = window.customElements.get(component.tag);
                if (compClassCtor === undefined) {
                    Logger_js_1.log.error(`${tag} is not [yet?] registered, have you called customElements.define('${tag}', <class name>) in the app.ts file?`);
                    return;
                }
                Logger_js_1.log.info(`Creating new component '${component.tag}'`);
                componentToInsert = new compClassCtor();
            }
            else {
                Logger_js_1.log.info(`Found existing component ${tag}`);
                Logger_js_1.assert(component.instance != null);
                componentToInsert = component.instance;
            }
            let targetElement = route.parent;
            let parentNode = document.querySelector(targetElement);
            if (parentNode == null) {
                Logger_js_1.log.error(`loadComponent(): Could not find element ${targetElement} in current document`);
                return;
            }
            let componentToReplace = parentNode.firstChild;
            if (componentToReplace == null) {
                Logger_js_1.log.error(`Element ${targetElement} has no child element to replace`);
                return;
            }
            this.Slug = route.slug;
            Logger_js_1.log.highlight(`Router slug changed, slug=${this.Slug}`);
            parentNode.replaceChild(componentToInsert, componentToReplace);
            if (setState) {
                Logger_js_1.log.info(`Calling history.pushstate(${JSON.stringify(route)})`);
                history.pushState(route, 'title', route.slug);
            }
        }
        onPopstate(ev) {
            Logger_js_1.log.event('Router.onPopstate() called');
            let route = ev.state;
            if (route == null) {
                Logger_js_1.log.warn('onPopstate(), pushstate is null, cannot go backwards any further');
                return;
            }
            Logger_js_1.log.debug(route);
            this.loadComponent(route, false);
        }
        onUrlChanged(ev) {
            Logger_js_1.log.event('Router.onUrlChanged() called');
            Logger_js_1.log.debug(ev);
            Logger_js_1.log.error('unexpected call to onUrlChanged()');
        }
        onPushstate(ev) {
            Logger_js_1.log.event('Router.onPushstate() called');
            Logger_js_1.log.debug(ev);
            Logger_js_1.log.error('unexpected call to onPushstate()');
        }
    }
    exports.Router = Router;
});
define("WebComponents/BaseComponent/TemplateParser", ["require", "exports", "WebComponents/BaseComponent/Logger"], function (require, exports, Logger_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplateParser {
        constructor(component) {
            this.component = component;
            this.eventCount = 1;
            this.inputCountMap = new Map();
        }
        isFunctionName(code) {
            let regexFunctionName = RegExp(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/);
            return regexFunctionName.test(code);
        }
        AddEventHandler(attribName, eventName, code) {
            let els = this.component.getShadowElementsByAttribName(attribName);
            if (els.length == undefined) {
                Logger_js_2.log.error(`BaseComponent.AddEventHandler(): HTML element with attrib ${attribName} was not found within component ${this.component.TagName}`);
                return;
            }
            Logger_js_2.assert(els.length == 1);
            let el = els[0];
            if (this.isFunctionName(code)) {
                let existingUserFn = this.component.getFunctionByName(code);
                el.addEventListener(eventName, existingUserFn.bind(this.component));
            }
            else {
                let componentName = this.component.constructor.name;
                let newAnonFn = new Function("event", `console.log('@${event} anon handler fired (${componentName})'); ${code}`);
                el.addEventListener(eventName, newAnonFn.bind(this.component));
            }
        }
        getDataAttrib(element) {
            let dataAttrib = element.match(/data-wc.-\w+/);
            Logger_js_2.assert(dataAttrib != null);
            return dataAttrib[0];
        }
        parseEventsInElement(element) {
            const dataAttrib = this.getDataAttrib(element);
            let events = this.getEventsInElement(element);
            for (let event of events) {
                let eventName = this.getAttribName(event.slice(1));
                let code = this.getAttribValue(event);
                this.AddEventHandler(dataAttrib, eventName, code);
            }
        }
        ParseAndAttachEvents(htmlTemplate) {
            htmlTemplate.replace(/<.+@.+>/gm, (key) => {
                this.parseEventsInElement(key);
                return '';
            });
        }
        getAttribValue(attribNameValue) {
            let value = attribNameValue.match(/"[^"]*"/);
            Logger_js_2.assert(value != null);
            return value[0].slice(1, -1);
        }
        getAttribName(attribNameValue) {
            let name = attribNameValue.match(/[^=]+=/);
            Logger_js_2.assert(name != null);
            return name[0].slice(0, -1);
        }
        ParseInput(inputElement) {
            Logger_js_2.log.info(`Parsing <input> element: ${inputElement}`);
            let names = this.getNameAttribs(inputElement);
            if (names.length !== 1)
                return inputElement;
            let name = this.getAttribValue(names[0]);
            let dataAttrib = this.component.getDataAttribWci(name);
            let inputFieldCount = this.inputCountMap.get(dataAttrib);
            if (inputFieldCount == undefined)
                inputFieldCount = 1;
            let countString = (inputFieldCount === 1) ? '' : inputFieldCount.toString();
            this.inputCountMap.set(dataAttrib, ++inputFieldCount);
            let dataAttribName = `${dataAttrib}${countString}`;
            return inputElement.slice(0, -1) + ` ${dataAttribName}>`;
        }
        parseInputElements(htmlTemplate) {
            let result = htmlTemplate.replace(/<input[^>]+>/gm, (key) => this.ParseInput(key));
            return result;
        }
        getEventsInElement(element) {
            let eventsFounds = element.match(/@[a-z]+[^=]*=[^"]*"[^"]+"/g);
            Logger_js_2.assert(eventsFounds != null);
            return eventsFounds;
        }
        ParseOther(element) {
            if (element.startsWith('<input'))
                return element;
            Logger_js_2.log.info(`Parsing non-input element: ${element}`);
            let firstEvent = this.getEventsInElement(element)[0];
            let eventName = this.getAttribName(firstEvent.slice(1));
            let dataAttrib = this.component.getDataAttribWce(eventName);
            let eventDataAttrib = `${dataAttrib}${this.eventCount++}`;
            return element.slice(0, -1) + ` ${eventDataAttrib}>`;
        }
        parseOtherElements(htmlTemplate) {
            let result = htmlTemplate.replace(/<[^>]+@[^>]+>/gm, (key) => {
                return this.ParseOther(key);
            });
            return result;
        }
        deKebab(kebab) {
            return kebab.replace(/-/g, '_');
        }
        removeHandlebars(propWithHandlerbars) {
            let propName = propWithHandlerbars.slice(2, -2);
            propName = this.deKebab(propName);
            return propName;
        }
        parseEs6Template(staticStrings, ...templateValues) {
            return { staticStrings, templateValues };
        }
        formatEs6Template(staticStrings, templateValues) {
            return staticStrings.reduce((result, _, i) => result + templateValues[i - 1] + staticStrings[i]);
        }
        parseHandlerbar(htmlIn, regexTarget, es6Template) {
            let htmlOut = htmlIn.replace(regexTarget, (key) => {
                let propName = this.removeHandlebars(key);
                let dataAttrib = this.component.getDataAttribWco(propName);
                let propValue = this.component.GetPropValue(propName);
                let actualValues = [];
                let hasPropName = es6Template.templateValues.indexOf('{propName}') >= 0;
                if (hasPropName)
                    actualValues.push(propName);
                let hasDataAttrib = es6Template.templateValues.indexOf('{dataAttrib}') >= 0;
                if (hasDataAttrib)
                    actualValues.push(dataAttrib);
                let hasPropValue = es6Template.templateValues.indexOf('{propValue}') >= 0;
                if (hasPropValue)
                    actualValues.push(propValue);
                let spanString = this.formatEs6Template(es6Template.staticStrings, actualValues);
                return spanString;
            });
            return htmlOut;
        }
        stripComments(htmlIn) {
            let htmlOut = htmlIn.replace(/<!--[\s\S]*?-->/g, '');
            return htmlOut;
        }
        replaceOneWayHandlerbars(htmlIn) {
            let dataAttrib = '{dataAttrib}';
            let propValue = '{propValue}';
            let htmlOut = this.parseHandlerbar(htmlIn, /{{[A-Za-z0-9_-]+}}/gm, this.parseEs6Template `<span ${dataAttrib}>${propValue}</span>`);
            return htmlOut;
        }
        replaceOneTimeHandlerbars(htmlIn) {
            let propValue = '{propValue}';
            let htmlOut = this.parseHandlerbar(htmlIn, /\[\[[A-Za-z0-9_-]+\]\]/gm, this.parseEs6Template `${propValue}`);
            return htmlOut;
        }
        parseHtmlTemplate(htmlTemplate) {
            let parsedHtml = this.stripComments(htmlTemplate);
            parsedHtml = this.replaceOneTimeHandlerbars(parsedHtml);
            parsedHtml = this.replaceOneWayHandlerbars(parsedHtml);
            parsedHtml = this.parseInputElements(parsedHtml);
            parsedHtml = this.parseOtherElements(parsedHtml);
            Logger_js_2.log.info(`Template parsing completed for component ${this.component.TagName}:`);
            Logger_js_2.log.template(parsedHtml);
            return parsedHtml;
        }
        loadHtmlTemplate() {
            return __awaiter(this, void 0, void 0, function* () {
                let tagName = this.component.TagName;
                let templateFilename = `/WebComponents/${tagName}/${tagName}.html`;
                templateFilename = templateFilename.replace(/-/gm, '');
                let response = yield fetch(templateFilename);
                if (response == null) {
                    return Logger_js_2.log.error(`Cannot load template with id ${tagName} in ${templateFilename}`);
                }
                let html = yield response.text();
                return html;
            });
        }
        insertTemplateIntoDocument(templateHtml) {
            let head = document.querySelector('head');
            if (head == null) {
                Logger_js_2.log.error('<head> element not found in doc, aborting');
                return false;
            }
            head.insertAdjacentHTML('beforeend', templateHtml);
            return true;
        }
        loadAndParseTemplate() {
            return __awaiter(this, void 0, void 0, function* () {
                let html = yield this.loadHtmlTemplate();
                let parsedTemplate = this.parseHtmlTemplate(html);
                this.insertTemplateIntoDocument(parsedTemplate);
                this.component.TemplateHtml = parsedTemplate;
                this.cloneAndAttachTemplate(true);
            });
        }
        cloneAndAttachTemplate(showErrors) {
            const templateName = `#${this.component.TagName}`;
            const template = document.querySelector(templateName);
            if (template == null) {
                let errMsg = `Cannot find template with id ${templateName} in current html document`;
                if (showErrors)
                    Logger_js_2.log.error("ERROR:" + errMsg);
                else
                    Logger_js_2.log.info("Deferring component creation to connectedCallback(): " + errMsg);
                return;
            }
            const templateContent = template.content;
            this.component.ShadRoot.appendChild(templateContent.cloneNode(true));
            Logger_js_2.log.info(`HTML template has been attached for ${this.component.TagName}`);
            this.ParseAndAttachEvents(template.innerHTML);
        }
        getNameAttribs(htmlEl) {
            var _a;
            let names = (_a = htmlEl.match(/name="[^"]+"/g), (_a !== null && _a !== void 0 ? _a : []));
            Logger_js_2.log.debug(`Found ${names.length} name attributes in element ${htmlEl}`);
            if (names.length === 0)
                Logger_js_2.log.error(`HTML template parsing error in component ${this.component.TagName}. Missing name attribute in ${htmlEl}`);
            if (names.length > 1)
                Logger_js_2.log.error(`HTML template parsing error in component ${this.component.TagName}. Duplicate name attribute(s) specified in ${htmlEl}`);
            return names;
        }
    }
    exports.default = TemplateParser;
});
define("WebComponents/BaseComponent/BaseComponent", ["require", "exports", "WebComponents/BaseComponent/Router", "WebComponents/BaseComponent/TemplateParser", "WebComponents/BaseComponent/Logger"], function (require, exports, Router_js_1, TemplateParser_js_1, Logger_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseComponent extends HTMLElement {
        constructor() {
            var _a;
            super();
            Logger_js_3.log.func(`${this.constructor.name} ctor() called`);
            this._shadRoot = this.attachShadow({ mode: 'open' });
            Logger_js_3.assert(this._shadRoot != null, `attachShadow() failed from component ${this.constructor.name}}`);
            let host = this.ShadRoot.host;
            Logger_js_3.assert(host != undefined, `host element doesn't exist for component ${this.constructor.name}}`);
            let parent = host.parentElement;
            let parentKey = 'main';
            if (parent != undefined) {
                let parentId = (_a = parent) === null || _a === void 0 ? void 0 : _a.id;
                parentKey = (parentId == undefined || parentId == "") ? parent.tagName.toLowerCase() : `#${parentId}`;
            }
            let component = { slug: '', tag: this.TagName, parent: parentKey, instance: this };
            BaseComponent.Router.addComponent(component);
            let parser = new TemplateParser_js_1.default(this);
            parser.cloneAndAttachTemplate(false);
        }
        get TagName() {
            return this.constructor.tag;
        }
        get TemplateHtml() {
            return this.constructor._templateHtml;
        }
        set TemplateHtml(value) {
            this.constructor._templateHtml = value;
        }
        get ShadRoot() { return this._shadRoot; }
        set ShadRoot(value) { this._shadRoot = value; }
        getFunctionByName(funcName) {
            let funcKey = funcName;
            let fn = this[funcKey];
            if (fn == undefined) {
                Logger_js_3.log.error(`Function '${funcName}' specified within html template for component '${this.constructor.name}' does not exist. Have you forgotten to add it to the component class?`);
            }
            return fn;
        }
        getNestedPropValue(path) {
            let result = path.split('.').reduce((obj, key) => obj[key]);
            return result;
        }
        GetPropValue(propName) {
            let nestedVal = this.getNestedPropValue(propName);
            Logger_js_3.log.debug(`propName=${propName}, nestedVal=${nestedVal}`);
            let propKey = propName;
            if (!(propKey in this)) {
                Logger_js_3.log.error(`HTML Template Error: Property/field '${propKey}' does not exist in ${this.constructor.name}. You need to declare this in ${this.constructor.name}.ts as well as adding the necessary decorator (@PropOut or @Attrib)`);
            }
            let propValue = this[propKey];
            return propValue;
        }
        getDataAttribWco(propName) {
            return `data-wco-${propName}`;
        }
        getDataAttribWci(propName) {
            return `data-wci-${propName}`;
        }
        getDataAttribWce(propName) {
            return `data-wce-${propName}`;
        }
        getShadowElementsByAttribName(attribName) {
            let shad = this.shadowRoot;
            if (shad == null) {
                Logger_js_3.log.error('GetShadowElement(): this.shadowRoot is null');
                return {};
            }
            let elems = shad.querySelectorAll(`[${attribName}]`);
            if (elems == null) {
                Logger_js_3.log.error(`GetShadowElement(): element with attribute ${attribName} not found`);
                return {};
            }
            return elems;
        }
        SetElementContent(propName) {
            if (this.TemplateHtml == "") {
                Logger_js_3.log.warn("SetElementContent(): TemplateHtml is null, ignoring call");
                return;
            }
            let attribName = this.getDataAttribWco(propName);
            let propValue = String(this[propName]);
            let elems = this.getShadowElementsByAttribName(attribName);
            if (elems == null || elems.length === 0)
                Logger_js_3.log.error(`SetElementContent(): Could not find element with attribute ${attribName} inside component ${this.constructor.name}`);
            else {
                for (let el of elems)
                    el.innerHTML = propValue;
            }
        }
        connectedCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_3.log.event(`${this.constructor.name}.connectedCallback() called`);
                if (this.TemplateHtml != "") {
                    Logger_js_3.log.info(`Component ${this.TagName} template is already initialised, exiting connectedCallback`);
                    return;
                }
                if (!customElements.whenDefined(this.TagName)) {
                    Logger_js_3.log.error(`${this.TagName} is not [yet?] registered, have you called customElements.define('${this.TagName}', '${this.constructor.name}') in the app.ts file?`);
                    return;
                }
                Logger_js_3.log.info(`Component ${this.TagName} NOT initialised, awaiting html template load/parse...`);
                let parser = new TemplateParser_js_1.default(this);
                yield parser.loadAndParseTemplate();
            });
        }
        disconnectedCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_3.log.event(`${this.constructor.name}.disconnectedCallback() called`);
            });
        }
        attributeChangedCallback(custAttrName, oldVal, newVal) {
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_3.log.event(`attributeChangedCallback(): Attribute name : ${custAttrName}, old value: ${oldVal}, new value: ${newVal}`);
            });
        }
        adoptedCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_3.log.event(`{this.constructor.name}.adoptedCallback(): called`);
                Logger_js_3.log.error('Unxpected call to BaseComponent.adoptedCallback()');
            });
        }
        loadComponent(tag, parent, slug, setState = true) {
            let route = { slug, tag, parent };
            BaseComponent.Router.loadComponent(route, setState);
        }
    }
    exports.default = BaseComponent;
    BaseComponent.Router = new Router_js_1.Router();
    BaseComponent.tag = "BaseComponent (not used)";
    BaseComponent._templateHtml = "";
});
define("WebComponents/BaseComponent/PropDecorator", ["require", "exports", "WebComponents/BaseComponent/Logger"], function (require, exports, Logger_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PropOut(target, propName) {
        Object.defineProperty(target, propName, {
            get: function () { return this['_' + propName]; },
            set: function (value) {
                Logger_js_4.log.info(`${this.constructor.name}.${propName} = ${value}`);
                this['_' + propName] = value;
                this.SetElementContent(propName);
            },
            enumerable: true,
            configurable: true
        });
    }
    exports.PropOut = PropOut;
    function Attrib(target, fieldName) {
        Object.defineProperty(target, fieldName, {
            get: function () {
                const attribName = fieldName.replace(/_/g, '-');
                let value = this.getAttribute(attribName);
                if (value == undefined)
                    Logger_js_4.log.error(`Could not find attribute ${attribName} on element ${this.TagName}`);
                return value;
            },
            set: function (value) {
                const attribName = fieldName.replace(/_/g, '-');
                Logger_js_4.log.info(`${this.constructor.name}.${attribName} = ${value}`);
                this.setAttribute(attribName, value);
            },
            enumerable: true,
            configurable: true
        });
    }
    exports.Attrib = Attrib;
});
define("WebComponents/MyHeader/MyHeader", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/PropDecorator"], function (require, exports, BaseComponent_js_1, PropDecorator_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyHeader extends BaseComponent_js_1.default {
        constructor() {
            super();
        }
        static get observedAttributes() {
            return ['title', 'my-cust-attrib'];
        }
    }
    MyHeader.tag = 'my-header';
    __decorate([
        PropDecorator_js_1.Attrib
    ], MyHeader.prototype, "title", void 0);
    __decorate([
        PropDecorator_js_1.Attrib
    ], MyHeader.prototype, "my_cust_attrib", void 0);
    exports.default = MyHeader;
    customElements.define(MyHeader.tag, MyHeader);
});
define("WebComponents/MyFooter/MyFooter", ["require", "exports", "WebComponents/BaseComponent/BaseComponent"], function (require, exports, BaseComponent_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyFooter extends BaseComponent_js_2.default {
        constructor() {
            super();
            this.copyright = `(c) Widget Ltd ${new Date().getFullYear()}`;
        }
    }
    exports.default = MyFooter;
    MyFooter.tag = 'my-footer';
    customElements.define(MyFooter.tag, MyFooter);
});
define("WebComponents/MyAside/MyAside", ["require", "exports", "WebComponents/BaseComponent/BaseComponent"], function (require, exports, BaseComponent_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyAside extends BaseComponent_js_3.default {
        constructor() {
            super();
        }
    }
    exports.default = MyAside;
    MyAside.tag = 'my-aside';
    customElements.define(MyAside.tag, MyAside);
});
define("WebComponents/MyContent/MyContent", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/PropDecorator", "WebComponents/BaseComponent/Logger"], function (require, exports, BaseComponent_js_4, PropDecorator_js_2, Logger_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyContent extends BaseComponent_js_4.default {
        constructor() {
            super();
            this.a = 3;
            this.b = 5;
        }
        get total() { return this.a + this.b; }
        connectedCallback() {
            const _super = Object.create(null, {
                connectedCallback: { get: () => super.connectedCallback }
            });
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_5.log.event('sub: MyContent.connectedCallback() called');
                yield _super.connectedCallback.call(this);
                Logger_js_5.log.info('sub: MyContent.connectedCallback() base class completed (allegedly)');
            });
        }
        increaseA(ev) {
            let el = ev.currentTarget;
            Logger_js_5.log.event(`MyContent.increaseA() fired ${el}`);
            this.a = el.valueAsNumber;
        }
        increaseB(ev) {
            let el = ev.currentTarget;
            Logger_js_5.log.event(`MyContent.increaseB() fired ${el}`);
            this.b = el.valueAsNumber;
        }
        onTotalChanged() {
        }
    }
    MyContent.tag = 'my-content';
    __decorate([
        PropDecorator_js_2.PropOut
    ], MyContent.prototype, "a", void 0);
    __decorate([
        PropDecorator_js_2.PropOut
    ], MyContent.prototype, "b", void 0);
    exports.default = MyContent;
    customElements.define(MyContent.tag, MyContent);
});
define("WebComponents/HtmlPage/HtmlPage", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/Logger"], function (require, exports, BaseComponent_js_5, Logger_js_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HtmlPage extends BaseComponent_js_5.default {
        constructor() {
            super();
            this.PageName = '';
            this.PageContent = '';
        }
        connectedCallback() {
            const _super = Object.create(null, {
                connectedCallback: { get: () => super.connectedCallback }
            });
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_6.log.event('sub: HtmlPage.connectedCallback() called');
                yield _super.connectedCallback.call(this);
                const slug = BaseComponent_js_5.default.Router.Slug;
                Logger_js_6.log.highlight(`Router.Slug is '${slug}'`);
                this.PageName = slug;
                let response = yield fetch(`/WebComponents/TestData/${this.PageName}.html`);
                this.PageContent = yield response.text();
                this.SetElementContent('PageName');
                this.SetElementContent('PageContent');
                Logger_js_6.log.info('sub: HtmlPage.connectedCallback() base class completed');
            });
        }
    }
    exports.default = HtmlPage;
    HtmlPage.tag = 'html-page';
    customElements.define(HtmlPage.tag, HtmlPage);
});
define("WebComponents/MyCounter/MyCounter", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/PropDecorator"], function (require, exports, BaseComponent_js_6, PropDecorator_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyCounter extends BaseComponent_js_6.default {
        constructor() {
            super();
            this.count = 123;
        }
    }
    MyCounter.tag = 'my-counter';
    __decorate([
        PropDecorator_js_3.PropOut
    ], MyCounter.prototype, "count", void 0);
    exports.default = MyCounter;
    customElements.define(MyCounter.tag, MyCounter);
});
define("WebComponents/BaseComponent/BaseInputForm", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/Logger"], function (require, exports, BaseComponent_js_7, Logger_js_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseInputForm extends BaseComponent_js_7.default {
        constructor() {
            super();
            Logger_js_7.log.func(`BaseInputForm<T> (${this.constructor.name}) ctor called`);
        }
        connectedCallback() {
            const _super = Object.create(null, {
                connectedCallback: { get: () => super.connectedCallback }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.connectedCallback.call(this);
                Logger_js_7.log.event(`${this.constructor.name}.connectedCallback() called`);
                this.copyDtoToFormA(this.dto);
            });
        }
        onSubmit() {
            Logger_js_7.log.event(`${this.constructor.name}.onSubmit() called`);
            this.dto = this.copyFormToDtoA(this.dto);
            Logger_js_7.log.debug(this.dto);
        }
        copyFormToDtoA(idto) {
            const odto = {};
            const ownKeys = Reflect.ownKeys(idto);
            for (const propName of ownKeys) {
                let propKey = propName;
                let propValue = idto[propKey];
                let attribName = this.getDataAttribWci(propName);
                let inputEls = this.getShadowElementsByAttribName(attribName);
                Logger_js_7.assert(inputEls.length === 1, `copyFormToDtoA(): Expected to find single <input> element, actually found ${inputEls.length} elements`);
                Logger_js_7.log.debug(`prop = ${propName}, dataAttrib = ${attribName}, ${inputEls.length}`);
                let inputEl = inputEls[0];
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
                            Logger_js_7.log.error('copyDtoToFormA() - non-Date object encountered');
                        break;
                    case 'boolean':
                        let boolVal = (inputEl.value === 'true' && inputEl.checked) || (inputEl.value === 'false' && !inputEl.checked);
                        odto[propName] = boolVal;
                        break;
                    default:
                        Logger_js_7.log.error(`copyDtoToFormA() - hit default in switch, type was '${typeName}'`);
                }
            }
            return odto;
        }
        copyDtoToFormA(dto) {
            const ownKeys = Reflect.ownKeys(dto);
            for (const propName of ownKeys) {
                let attribName = this.getDataAttribWci(propName);
                let inputEls = this.getShadowElementsByAttribName(attribName);
                if (inputEls.length == undefined)
                    continue;
                Logger_js_7.assert(inputEls.length === 1, `copyDtoToFormA(): Expected to find single <input> element, actually found ${inputEls.length} elements`);
                Logger_js_7.log.debug(`prop = ${propName}, dataAttrib = ${attribName}, ${inputEls.length}`);
                let inputEl = inputEls[0];
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
                            Logger_js_7.log.error('copyDtoToFormA() - non-Date object encountered');
                        break;
                    case 'boolean':
                        let firstRadioTrue = (inputEl.value === 'true');
                        inputEl.checked = firstRadioTrue ? propValue : !propValue;
                        break;
                    default:
                        Logger_js_7.log.error(`copyDtoToFormA() - hit default in switch, type was '${type}'`);
                }
            }
        }
    }
    exports.default = BaseInputForm;
});
define("WebComponents/PersonForm/Person", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Person {
        constructor() {
            this.forename = 'John';
            this.surname = 'Smith';
            this.dob = new Date();
            this.age = 55;
            this.alive = true;
        }
    }
    exports.default = Person;
});
define("WebComponents/PersonForm/PersonForm", ["require", "exports", "WebComponents/BaseComponent/BaseInputForm", "WebComponents/PersonForm/Person", "WebComponents/BaseComponent/PropDecorator", "WebComponents/BaseComponent/Logger"], function (require, exports, BaseInputForm_js_1, Person_js_1, PropDecorator_js_4, Logger_js_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PersonForm extends BaseInputForm_js_1.default {
        constructor() {
            super();
            this.forename = '';
            this.surname = '';
            this.alive = true;
            this.dto = new Person_js_1.default();
            Logger_js_8.log.func('PersonForm.ctor() called');
            Logger_js_8.log.info('this.dto was initialised with these values:');
            Logger_js_8.log.debug(this.dto);
        }
        onSubmit() {
            super.onSubmit();
            Logger_js_8.log.func('PersonForm.onSubmit() called, dto has now been updated');
            Logger_js_8.log.info('this.dto updated values are:');
            Logger_js_8.log.debug(this.dto);
        }
    }
    PersonForm.tag = 'person-form';
    __decorate([
        PropDecorator_js_4.PropOut
    ], PersonForm.prototype, "forename", void 0);
    __decorate([
        PropDecorator_js_4.PropOut
    ], PersonForm.prototype, "surname", void 0);
    __decorate([
        PropDecorator_js_4.PropOut
    ], PersonForm.prototype, "alive", void 0);
    exports.default = PersonForm;
    customElements.define(PersonForm.tag, PersonForm);
});
define("app", ["require", "exports", "WebComponents/BaseComponent/Logger", "WebComponents/MyHeader/MyHeader", "WebComponents/MyFooter/MyFooter", "WebComponents/MyAside/MyAside", "WebComponents/MyContent/MyContent", "WebComponents/HtmlPage/HtmlPage", "WebComponents/MyCounter/MyCounter", "WebComponents/PersonForm/PersonForm"], function (require, exports, Logger_js_9, MyHeader_js_1, MyFooter_js_1, MyAside_js_1, MyContent_js_1, HtmlPage_js_1, MyCounter_js_1, PersonForm_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function checkComponentRegistered(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            let ctor = yield customElements.get(tag);
            if (ctor == undefined)
                Logger_js_9.log.error(`Component registration failed for '${tag}'`);
            else {
                Logger_js_9.log.info(`Component registration succeeded for '${tag}':`);
                Logger_js_9.log.debug(ctor);
            }
        });
    }
    checkComponentRegistered(MyHeader_js_1.default.tag);
    checkComponentRegistered(MyFooter_js_1.default.tag);
    checkComponentRegistered(MyAside_js_1.default.tag);
    checkComponentRegistered(MyContent_js_1.default.tag);
    checkComponentRegistered(HtmlPage_js_1.default.tag);
    checkComponentRegistered(MyCounter_js_1.default.tag);
    checkComponentRegistered(PersonForm_js_1.default.tag);
});
define("WebComponents/Alert/Alert", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/Logger"], function (require, exports, BaseComponent_js_8, Logger_js_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Alert extends BaseComponent_js_8.default {
        constructor() {
            super();
            this.title = '';
            this.content = '';
        }
        connectedCallback() {
            const _super = Object.create(null, {
                connectedCallback: { get: () => super.connectedCallback }
            });
            return __awaiter(this, void 0, void 0, function* () {
                Logger_js_10.log.func('sub: Alert.connectedCallback() called');
                yield _super.connectedCallback.call(this);
                this.SetElementContent('title');
                this.SetElementContent('content');
                Logger_js_10.log.func('sub: Alert.connectedCallback() completed');
            });
        }
    }
    exports.default = Alert;
    Alert.tag = 'oo-alert';
    customElements.define(Alert.tag, Alert);
});
define("WebComponents/MyTime/MyTime", ["require", "exports", "WebComponents/BaseComponent/BaseComponent", "WebComponents/BaseComponent/PropDecorator"], function (require, exports, BaseComponent_js_9, PropDecorator_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyTime extends BaseComponent_js_9.default {
        constructor() {
            super();
        }
        connectedCallback() {
            const _super = Object.create(null, {
                connectedCallback: { get: () => super.connectedCallback }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.connectedCallback.call(this);
                let format = this.format;
                if (format == undefined)
                    format = 'local';
                switch (format) {
                    case 'utc':
                        this.time = Date.UTC.toString();
                        break;
                    case 'local':
                        this.time = Date.now.toString();
                        break;
                    default:
                        this.time = `Only format="utc" and format="local" are valid values for the my-time format attribute`;
                }
            });
        }
    }
    MyTime.tag = 'my-time';
    __decorate([
        PropDecorator_js_5.Attrib
    ], MyTime.prototype, "format", void 0);
    __decorate([
        PropDecorator_js_5.PropOut
    ], MyTime.prototype, "time", void 0);
    exports.default = MyTime;
    customElements.define(MyTime.tag, MyTime);
});
//# sourceMappingURL=build.js.map