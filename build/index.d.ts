import { IDisposable } from 'phosphor-disposable';
import { Widget } from 'phosphor-widget';
/**
 * A widget which hosts a Notebook.
 */
export declare class Notebook extends Widget {
    static createNode(): HTMLElement;
    constructor();
    start(kernelOptions: any): void;
    execute_cell_and_select_below(): void;
    private _createCell();
    private _events;
    private _actions;
    private _manager;
    private _tooltip;
    private _kernel;
    private _cells;
}
export declare function loadDock(): Promise<any>;
export declare function loadMenu(): Promise<any>;
export declare function initialize(): IDisposable;
