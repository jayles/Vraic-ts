import BaseComponent from './BaseComponent.js';
export declare function Component<T extends BaseComponent>(tagName: string): Function;
export declare function Freeze(target: Function): void;
export declare function Output(...deps: string[]): (target: Object, propName: string) => void;
export declare function Output(target: Object, propName: string): void;
export declare function PropOut2(deps: string[]): any;
export declare function PropOut2(target: Object, propName: string): any;
export declare function PropOut(...outputDependencies: string[]): (target: Object, propName: string) => void;
export declare function Attrib<T extends BaseComponent>(target: T, fieldName: string): void;
