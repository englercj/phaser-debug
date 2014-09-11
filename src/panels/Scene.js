var Panel = require('./Panel');

function Scene(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'scene';
    this.title = 'Scene';
}

Scene.prototype = Object.create(Panel.prototype);
Scene.prototype.constructor = Scene;

module.exports = Scene;
