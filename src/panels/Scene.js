var Panel = require('./Panel'),
    ui = require('../util/ui');

function Scene(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'scene';
    this.title = 'Scene';

    this._tree = null;
}

Scene.prototype = Object.create(Panel.prototype);
Scene.prototype.constructor = Scene;

module.exports = Scene;

Scene.prototype.createPanelElement = function () {
    Panel.prototype.createPanelElement.call(this);

    this._tree = document.createElement('ul');

    ui.delegate(this._tree, 'click', 'li', this._onLiClick.bind(this));

    this.rebuildTree();

    this._panel.appendChild(this._tree);

    return this._panel;
};

Scene.prototype.rebuildTree = function () {
    ui.empty(this._tree);

    this._addNode(this._tree, this.game.stage);

    return div;
};

Scene.prototype._addNode = function (parent, node) {
    var li = document.createElement('li');

    ui.setText(li, node.constructor.name);

    if (node.children) {
        setClass(li, 'has-children');

        var childs = document.createElement('ul');

        for (var i = 0; i < node.children.length; ++i) {
            this._addNode(childs, node.children[i]);
        }

        li.appendChild(childs);
    }

    parent.appendChild(li);
};

Scene.prototype._onLiClick = function (e) {
    e.stopPropagation();

    ui.toggleClass(this, 'expanded');
};
