export declare function assert(condition: boolean, msg?: string): asserts condition;
export declare class Logger {
    constructor();
    info(msg: string): void;
    func(msg: string): void;
    event(msg: string): void;
    debug(msg: string | object): void;
    dump(obj: object, msg?: string): void;
    template(msg: string): void;
    warn(msg: string): void;
    error(msg: string): string;
    exception(msg: string): void;
    highlight(msg: string): void;
    trace(msg: string): void;
    stack(msg: string): void;
}
export declare var log: Logger;
