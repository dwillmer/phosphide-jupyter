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
  DockPanel
} from 'phosphor-dockpanel';

import {
  MenuItem
} from 'phosphor-menus';

import {
  Tab
} from 'phosphor-tabs';

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
  //var tab = new Tab('Notebook');
  //tab.closable = true;
  //DockPanel.setTab(notebook, tab);
  return notebook;
}

function newTab(name: string): Tab {
  var tab = new Tab('Notebook');
  tab.closable = true;
  return tab;
}

var MENU = [
  {
    "location": ["File", "New Notebook", "Python 3"],
    "command": "dock.new.codepanel",
    "short_desc": "Code Panel",
    "long_desc": "Adds a new Dock item with a Codemirror widget."
  },
  {
    "location": ["File", "New Notebook", "Julia"],
    "command": "notebook.new.julia"
  },
  {
    "location": ["File", "Open..."],
    "command": "notebook.open",
    "constraints": {
      "File": { before: ["Edit", "Cell", "View", "Help"] },
      "Open...": { before:["Make a copy...", "Rename..."] }
    }
  },
  {
    "location": ["File", "Make a copy..."],
    "command": "notebook.copy"
  },
  {
    "location": ["File", "Rename..."],
    "command": "notebook.rename"
  },
  {
    "location": ["File", "Save and checkpoint"],
    "command": "notebook.checkpoint.save"
  },
  {
    "location": ["File", "Revert to Checkpoint"],
    "command": "notebook.checkpoint.revert.<timestamp>"
  },
  {
    "location": ["File", "Print Preview"],
    "command": "notebook.print.preview"
  },
  {
    "location": ["File", "Download as", "IPython notebook"],
    "command": "notebook.download.as_ipynb"
  },
  {
    "location": ["File", "Download as", "PDF"],
    "command": "notebook.download.as_pdf"
  },
  {
    "location": ["File", "Trusted Notebook"],
    "command": "notebook.trusted"
  },
  {
    "location": ["File", "Close and Halt"],
    "command": "notebook.close_and_halt"
  },
  // Edit
  //
  {
    "location": ["Edit", "Cut Cell"],
    "command": "global.edit.cut_cell"
  },
  {
    "location": ["Edit", "Copy Cell"],
    "command": "global.edit.copy_cell"
  },
  {
    "location": ["Edit", "Paste Cell Above"],
    "command": "global.edit.paste_cell_above"
  },
  {
    "location": ["Edit", "Paste Cell Below"],
    "command": "global.edit.paste_cell_below"
  },
  {
    "location": ["Edit", "Paste Cell & Replace"],
    "command": "global.edit.paste_cell_replace"
  },
  {
    "location": ["Edit", "Spit Cell"],
    "command": "global.edit.split_cell"
  },
  {
    "location": ["Edit", "Merge Cell Above"],
    "command": "global.edit.merge_cell_above"
  },
  {
    "location": ["Edit", "Merge Cell Below"],
    "command": "global.edit.merge_cell_below"
  },
  {
    "location": ["Edit", "Move Cell Up"],
    "command": "global.edit.move_cell_up"
  },
  {
    "location": ["Edit", "Move Cell Down"],
    "command": "global.edit.move_cell_down"
  },
  {
    "location": ["Edit", "Edit Notebook Metadata"],
    "command": "global.edit.edit_metadata"
  },
  // View
  //
  {
    "location": ["View", "Toggle Header"],
    "command": "global.view.toggle_header"
  },
  {
    "location": ["View", "Toggle Toolbar"],
    "command": "global.view.toggle_toolbar"
  },
  // Cell
  //
  {
    "location": ["Cell", "Run"],
    "command": "cell.run",
  },
  {
    "location": ["Cell", "Run and Select Below"],
    "command": "cell.run_select_below"
  },
  {
    "location": ["Cell", "Run and Insert below"],
    "command": "cell.run_insert_below"
  },
  {
    "location": ["Cell", "Run All"],
    "command": "cell.run_all"
  },
  {
    "location": ["Cell", "Run All Above"],
    "command": "cell.run_all_above"
  },
  {
    "location": ["Cell", "Run All Below"],
    "command": "cell.run_all_below"
  },
  {
    "location": ["Cell", "Cell Type", "Code"],
    "command": "cell.type.code"
  },
  {
    "location": ["Cell", "Cell Type", "Markdown"],
    "command": "cell.type.markdown"
  },
  {
    "location": ["Cell", "Cell Type", "Raw NBConvert"],
    "command": "cell.type.nbconvert"
  },

  // Kernel
  //
  {
    "location": ["Kernel", "Interrupt"],
    "command": "global.kernel.interrupt",
    "constraints": {
      "Interrupt": { before: ["Restart", "Reconnect"] }
    }
  },
  {
    "location": ["Kernel", "Restart"],
    "command": "global.kernel.restart"
  },
  {
    "location": ["Kernel", "Reconnect"],
    "command": "global.kernel.reconnect"
  },
  {
    "location": ["Kernel", "Change kernel", "Python 3"],
    "command": "global.kernel.change.python_3"
  },
  {
    "location": ["Kernel", "Change kernel", "Julia"],
    "command": "global.kernel.change.julia"
  },
  // Help
  //
  {
    "location": ["Help", "User Interface Tour"],
    "command": "global.help.ui_tour"
  },
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
    var result = [];

    for (var i=0; i < MENU.length; ++i) {
      result.push({
        pointName: "menu.main",
        item: MENU[i]
      });
    }

    result.push({
      pointName: 'dockarea.main',
      item: newNotebook(),
      tab: newTab('Notebook')
    });

    return result;
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
