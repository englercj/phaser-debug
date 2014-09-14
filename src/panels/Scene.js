var Panel = require('./Panel'),
    ui = require('../util/ui');

function Scene(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'scene';
    this.title = 'Scene';

    this._tree = null;

    this.tree = null;
    this.details = null;
    this.refresh = null;
    this.selected = null;
}

Scene.prototype = Object.create(Panel.prototype);
Scene.prototype.constructor = Scene;

module.exports = Scene;

Scene.prototype.createPanelElement = function () {
    Panel.prototype.createPanelElement.call(this);

    this.tree = document.createElement('ul');
    this.details = document.createElement('div');
    this.refresh = document.createElement('a');

    this.refresh.href = '#';
    ui.setText(this.refresh, 'refresh');

    ui.addClass(this.details, 'details');
    ui.addClass(this.refresh, 'refresh');

    ui.on(this.tree, 'click', 'li', this._onLiClick.bind(this));
    ui.on(this.refresh, 'click', this._onRefreshClick.bind(this));

    this.rebuildTree();

    this.details.appendChild(this.refresh);

    this._panel.appendChild(this.tree);
    this._panel.appendChild(this.details);

    return this._panel;
};

Scene.prototype.rebuildTree = function () {
    ui.empty(this.tree);

    this.selected = this._addNode(this.tree, this.game.stage);

    ui.addClass(this.selected, 'expanded selected');
};

Scene.prototype._addNode = function (parent, node) {
    var li = document.createElement('li');

    li.appendChild(document.createTextNode(this._typeToString(node)));

    if (node.name) {
        var name = document.createElement('span');
        ui.addClass(name, 'name');
        ui.setText(name, ' (' + node.name + ')');

        li.appendChild(name);
    }

    if (node.children && node.children.length) {
        ui.addClass(li, 'has-children');

        var childs = document.createElement('ul');

        for (var i = 0; i < node.children.length; ++i) {
            this._addNode(childs, node.children[i]);
        }

        li.appendChild(childs);
    }

    parent.appendChild(li);

    return li;
};

Scene.prototype._onLiClick = function (e) {
    e.stopPropagation();

    ui.removeClass(this.selected, 'selected');

    this.selected = e.delegateTarget;

    ui.addClass(this.selected, 'selected');
    ui.toggleClass(this.selected, 'expanded');
};

Scene.prototype._onRefreshClick = function (e) {
    this.rebuildTree();
};

Scene.prototype._typeToString = function (node) {
    // If no phaser type defined, try to guess
    if (node.type === undefined) {
        if (node instanceof PIXI.Stage) {
            return 'PIXI Stage';
        }
        else if (node instanceof PIXI.Sprite) {
            return 'PIXI Sprite';
        }
        else if (node instanceof PIXI.DisplayObjectContainer) {
            return 'PIXI DisplayObjectContainer';
        }
        else if (node instanceof PIXI.DisplayObject) {
            return 'PIXI DisplayObject';
        }
        else {
            return 'Unknown';
        }
    }
    // return a string for the phaser type
    else {
        switch(node.type) {
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
                return 'Unknown';
        }
    }
};
