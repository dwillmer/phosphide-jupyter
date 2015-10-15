/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  ActionHandler
} from './actions';

import {
  CodeCell
} from './codecell';

import {
  KeyboardManager
} from './keyboardmanager';

import {
  Tooltip
} from './tooltip';

import {
  IExtension, IExtensionPoint
} from 'phosphide';

import {
  IDisposable, DisposableDelegate
} from 'phosphor-disposable';

import {
  MenuItem
} from 'phosphor-menus';

import {
  ResizeMessage, Widget, attachWidget
} from 'phosphor-widget';

import {
  startNewKernel, Contents
} from '../jupyter-js-services/index';

//import './style.min.css';
import './ipython.min.css';
import './index.css';

/**
 * A widget which hosts a Notebook.
 */
export
class Notebook extends Widget {

  static createNode(): HTMLElement {
    var node = document.createElement('div');
    var container = document.createElement('div');
    var tooltip = document.createElement('div');
    container.className = 'container notebook-container';
    tooltip.className = 'ipython_tooltip';
    tooltip.style.display = 'none';
    node.appendChild(container);
    node.appendChild(tooltip);
    return node;
  }

  constructor() {
    super();
    this.addClass('content');
    this.addClass('NotebookWidget');
  }

  start(kernelOptions) {
    startNewKernel(kernelOptions).then(kernel => {
      this._kernel = kernel;
      var Events = function () {};
      this._events = $([new Events()]);
      var env = { notebook: this };

      this._actions = new ActionHandler({ env: env });

      this._manager = new KeyboardManager({
          notebook: this,
          events: this._events,
          actions: this._actions });
      this._manager.mode = 'edit';

      this._tooltip = new Tooltip(this._events, this.node.lastChild);
      this._createCell();
    });
  }

  execute_cell_and_select_below() {
    this._cells[this._cells.length - 1].execute();
    this._cells[this._cells.length - 1].unselect();
    this._createCell();
  }

  private _createCell() {

    var options = {
      keyboard_manager: this._manager,
      notebook: this,
      events: this._events,
      tooltip: this._tooltip
    }
    var cell = new CodeCell(this._kernel, options);
    this.node.children[0].appendChild(cell.element[0]);

    cell.set_input_prompt();
    cell.select();
    cell.focus_editor();
    cell.selection_anchor = true;
    cell.render();
    cell.refresh();
    cell.mode = 'edit';

    var args = { 'cell': cell, 'index': this._cells.length };
    this._events.trigger('create.Cell', args);
    this._cells.push(cell);
  }

  private _events: any = null;
  private _actions: any = null;
  private _manager: any = null;
  private _tooltip: any = null;
  private _kernel: any = null;
  private _cells: any[] = [];
}


var ADDRESS = 'localhost:8888';


function newNotebook(): Notebook {
  var kernelOptions = {
    baseUrl: `http://${ADDRESS}`,
    wsUrl: `ws://${ADDRESS}`,
    name: 'python'
  }
  var notebook = new Notebook();
  notebook.start(kernelOptions);
  return notebook;
}


var JUPYTER_MENU_TEMPLATE = [
  {
    text: 'Jupyter',
    submenu: [
      {
        text: 'New Notebook',
        shortcut: 'Ctrl-N'
      }
    ]
  }
];


export 
class JupyterNotebookPlugin {
  constructor(id: string) {
    this.id = id;
  }

  extensionPoints(): IExtensionPoint[] {
    return [];
  }

  extensions(): IExtension[] {
    return [
      {
        pointName: 'menu.main',
        item: MenuItem.fromTemplate(JUPYTER_MENU_TEMPLATE)
      },
      {
        pointName: 'dockarea.main',
        item: newNotebook()
      }
    ];
  }

  load(): IDisposable {
    console.log('Loading jupyter notebook plugin');
    return;
  }

  unload(): void {
    console.log('Unloading jupyter notebook plugin');
  }

  isRuntimeLoaded(): boolean {
    return true;
  }

  id: string;
  requires: string[] = ['mainmenu', 'dockarea'];

  private _whatever;
}
