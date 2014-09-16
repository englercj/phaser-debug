var ui = require('../util/ui');

function Panel(game, parent) {
    this.game = game;
    this.parent = parent;

    this.name = '';
    this.title = '';
    this.active = false;

    this._panel = null;
}

Panel.prototype.constructor = Panel;

module.exports = Panel;

//builds the html for a panel
Panel.prototype.createPanelElement = function () {
    var elm = this._panel = document.createElement('div');
    ui.addClass(elm, 'pdebug-panel ' + this.name);

    return elm;
};

//builds the html for this panels menu item
Panel.prototype.createMenuElement = function () {
    var elm = this._menuItem = document.createElement('a');

    elm.href = '#' + this.name;

    ui.addClass(elm, 'pdebug-menu-item ' + this.name);
    ui.setText(elm, this.title);

    return elm;
};

Panel.prototype.toggle = function () {
    if (this.active) {
        this.hide();
    } else {
        this.show();
    }
};

Panel.prototype.show = function () {
    this.active = true;
    ui.setStyle(this._panel, 'display', 'block');
};

Panel.prototype.hide = function () {
    this.active = false;
    ui.setStyle(this._panel, 'display', 'none');
};

Panel.prototype.destroy = function () {
    this.game = null;
    this.parent = null;

    this.name = null;
    this.title = null;
    this.active = null;

    this._panel = null;
};
