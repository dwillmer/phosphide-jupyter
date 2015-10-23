/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var actions_1 = require('./actions');
var codecell_1 = require('./codecell');
var keyboardmanager_1 = require('./keyboardmanager');
var tooltip_1 = require('./tooltip');
var phosphor_tabs_1 = require('phosphor-tabs');
var phosphor_widget_1 = require('phosphor-widget');
var index_1 = require('../jupyter-js-services/index');
require('./ipython.min.css');
require('./index.css');
/**
 * A widget which hosts a Notebook.
 */
var Notebook = (function (_super) {
    __extends(Notebook, _super);
    function Notebook() {
        _super.call(this);
        this._events = null;
        this._actions = null;
        this._manager = null;
        this._tooltip = null;
        this._kernel = null;
        this._cells = [];
        this.addClass('content');
        this.addClass('NotebookWidget');
    }
    Notebook.createNode = function () {
        var node = document.createElement('div');
        var container = document.createElement('div');
        var tooltip = document.createElement('div');
        container.className = 'container notebook-container';
        tooltip.className = 'ipython_tooltip';
        tooltip.style.display = 'none';
        node.appendChild(container);
        node.appendChild(tooltip);
        return node;
    };
    Notebook.prototype.start = function (kernelOptions) {
        var _this = this;
        index_1.startNewKernel(kernelOptions).then(function (kernel) {
            _this._kernel = kernel;
            var Events = function () { };
            _this._events = $([new Events()]);
            var env = { notebook: _this };
            _this._actions = new actions_1.ActionHandler({ env: env });
            _this._manager = new keyboardmanager_1.KeyboardManager({
                notebook: _this,
                events: _this._events,
                actions: _this._actions });
            _this._manager.mode = 'edit';
            _this._tooltip = new tooltip_1.Tooltip(_this._events, _this.node.lastChild);
            _this._createCell();
        });
    };
    Notebook.prototype.execute_cell_and_select_below = function () {
        this._cells[this._cells.length - 1].execute();
        this._cells[this._cells.length - 1].unselect();
        this._createCell();
    };
    Notebook.prototype._createCell = function () {
        var options = {
            keyboard_manager: this._manager,
            notebook: this,
            events: this._events,
            tooltip: this._tooltip
        };
        var cell = new codecell_1.CodeCell(this._kernel, options);
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
    };
    return Notebook;
})(phosphor_widget_1.Widget);
exports.Notebook = Notebook;
var ADDRESS = 'localhost:8888';
function newNotebook() {
    var kernelOptions = {
        baseUrl: "http://" + ADDRESS,
        wsUrl: "ws://" + ADDRESS,
        name: 'python'
    };
    var notebook = new Notebook();
    notebook.start(kernelOptions);
    //var tab = new Tab('Notebook');
    //tab.closable = true;
    //DockPanel.setTab(notebook, tab);
    return notebook;
}
function newTab(name) {
    var tab = new phosphor_tabs_1.Tab('Notebook');
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
            "Open...": { before: ["Make a copy...", "Rename..."] }
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
function loadDock() {
    return Promise.resolve({
        items: [newNotebook()],
        tabs: [newTab('Notebook')]
    });
}
function loadMenu() {
    return Promise.resolve({ items: MENU });
}
function initialize() {
    return void 0;
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map