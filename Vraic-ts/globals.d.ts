// Note that the 'declare' keyword is redundant and can be omitted from all type declarations
//
declare type Key<T> = T[keyof T];
declare type PropName<T> = keyof T;
declare type PropValue<T> = T[keyof T];

declare type Nullable<T> = T | null;
declare type Optional<T> = T | undefined;
declare type Nullish<T> = T | null | undefined;

// these are built-in type defs provied by TypeScript
//declare type Map<K, V> = {};
//declare type Dictionary<T> = { [key: string]: T };
//declare type StaticThis<T> = { new(): T };

declare type Constructor<T extends object> = {
	new(...args: any[]): T
};

// 'any' type also includes: symbol | BigInt
declare type AlmostAny = boolean | number | Date | string | object | undefined | null;
