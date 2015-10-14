import { IExtension, IExtensionPoint } from 'phosphide';
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
export declare class JupyterNotebookPlugin {
    constructor(id: string);
    extensionPoints(): IExtensionPoint[];
    extensions(): IExtension[];
    load(): IDisposable;
    unload(): void;
    isRuntimeLoaded(): boolean;
    id: string;
    requires: string[];
    private _whatever;
}
