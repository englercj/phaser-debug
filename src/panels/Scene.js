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
};

Scene.prototype._addNode = function (parent, node) {
    var li = document.createElement('li');

    ui.setText(li, this._typeToString(node.type) + (node.name ? '(' + node.name + ')' : ''));

    if (node.children) {
        ui.addClass(li, 'has-children');

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

    ui.toggleClass(e.target, 'expanded');
};

Scene.prototype._typeToString = function (type) {
    switch(type) {
        case Phaser.SPRITE:
            return 'Sprite';

        case Phaser.BUTTON:
            return 'Button';

        case Phaser.IMAGE:
            return 'Image';

        case Phaser.GRAPHICS:
            return 'Graphics';

        case Phaser.TEXT:
            return 'Text';

        case Phaser.TILESPRITE:
            return 'Tile Sprite';

        case Phaser.BITMAPTEXT:
            return 'Bitmap Text';

        case Phaser.GROUP:
            return 'Group';

        case Phaser.RENDERTEXTURE:
            return 'Render Texture';

        case Phaser.TILEMAP:
            return 'Tilemap';

        case Phaser.TILEMAPLAYER:
            return 'Tilemap Layer';

        case Phaser.EMITTER:
            return 'Emitter';

        case Phaser.POLYGON:
            return 'Polygon';

        case Phaser.BITMAPDATA:
            return 'Bitmap Data';

        case Phaser.CANVAS_FILTER:
            return 'Canvas Filter';

        case Phaser.WEBGL_FILTER:
            return 'WebGL Filter';

        case Phaser.ELLIPSE:
            return 'Ellipse';

        case Phaser.SPRITEBATCH:
            return 'Sprite Batch';

        case Phaser.RETROFONT:
            return 'Retro Font';

        case Phaser.POINTER:
            return 'Pointer';

        case Phaser.ROPE:
            return 'Rope';

        default:
            return '';
    }
};
