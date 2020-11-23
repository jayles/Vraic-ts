export default class ObjectProxy {
    private constructor();
    static createProxyFrom<T extends {}>(ctor: Constructor<T>): T;
}
