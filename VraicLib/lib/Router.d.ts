import BaseComponent from './BaseComponent.js';
export interface IComponent {
    slug: string;
    tag: string;
    parent: string;
    instance: Nullable<BaseComponent>;
}
export declare type IRoute = Omit<IComponent, 'instance'>;
export declare class Router {
    Slug: string;
    DefaultTag: string;
    DefaultParent: string;
    private _components;
    constructor();
    findRoute(slug: string): IRoute;
    private componentExists;
    addComponent(newComponent: IComponent): void;
    loadComponent(route: IRoute, setState?: boolean): Promise<void>;
    private checkForFailedComponents;
    protected onPopstate(ev: PopStateEvent): void;
    protected onUrlChanged(ev: Event): void;
    protected onPushstate(ev: Event): void;
}
