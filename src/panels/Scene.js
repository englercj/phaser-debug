var Panel = require('./Panel'),
    ui = require('../util/ui'),
    Handlebars = require('hbsfy/runtime');

//require templates
var panelHtml = require('../hbs/scene/panel.hbs'),
    detailsHtml = require('../hbs/scene/details.hbs'),
    treeHtml = require('../hbs/scene/tree.hbs');

Handlebars.registerPartial('sceneDetails', detailsHtml);
Handlebars.registerPartial('sceneTree', treeHtml);
Handlebars.registerHelper('typeString', typeToString);

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

    this._panel.innerHTML = panelHtml(this.game.stage);

    this.tree = this._panel.querySelector('.sidebar');
    this.details = this._panel.querySelector('.details');
    this.refresh = this.details.querySelector('.refresh');

    this.selected = this.tree.querySelector('li:first-child');
    ui.addClass(this.selected, 'selected expanded');

    ui.on(this.tree, 'click', 'li', this._onLiClick.bind(this));
    ui.on(this.refresh, 'click', this._onRefreshClick.bind(this));

    return this._panel;
};

Scene.prototype.rebuildTree = function () {
    ui.empty(this.tree);

    this.tree.innerHTML = treeHtml(this.game.stage);

    this.selected = this.tree.querySelector('li:first-child');
    ui.addClass(this.selected, 'selected expanded');

    this.reloadDetails();
};

Scene.prototype.reloadDetails = function () {
    //TODO: cache objects with custom IDs to reload here?
    // perhaps a hbs helper that will add to the cache and return the id?
};

Scene.prototype._onLiClick = function (e) {
    e.stopPropagation();

    if (this.selected) {
        ui.removeClass(this.selected, 'selected');
    }

    this.selected = e.delegateTarget;

    ui.addClass(this.selected, 'selected');
    ui.toggleClass(this.selected, 'expanded');

    this.reloadDetails();
};

Scene.prototype._onRefreshClick = function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.rebuildTree();
};

function typeToString () {
    var node = this;

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
