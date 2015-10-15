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
var phosphor_menus_1 = require('phosphor-menus');
var phosphor_tabs_1 = require('phosphor-tabs');
var phosphor_widget_1 = require('phosphor-widget');
var index_1 = require('../jupyter-js-services/index');
//import './style.min.css';
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
var JupyterNotebookPlugin = (function () {
    function JupyterNotebookPlugin(id) {
        this.requires = ['mainmenu', 'dockarea'];
        this.id = id;
    }
    JupyterNotebookPlugin.prototype.extensionPoints = function () {
        return [];
    };
    JupyterNotebookPlugin.prototype.extensions = function () {
        return [
            {
                pointName: 'menu.main',
                item: phosphor_menus_1.MenuItem.fromTemplate(JUPYTER_MENU_TEMPLATE)
            },
            {
                pointName: 'dockarea.main',
                item: newNotebook(),
                tab: newTab('Notebook')
            }
        ];
    };
    JupyterNotebookPlugin.prototype.load = function () {
        console.log('Loading jupyter notebook plugin');
        return;
    };
    JupyterNotebookPlugin.prototype.unload = function () {
        console.log('Unloading jupyter notebook plugin');
    };
    JupyterNotebookPlugin.prototype.isRuntimeLoaded = function () {
        return true;
    };
    return JupyterNotebookPlugin;
})();
exports.JupyterNotebookPlugin = JupyterNotebookPlugin;
//# sourceMappingURL=index.js.map