var MapPanel = require('./panels/Map'),
    SpritesPanel = require('./panels/Sprites'),
    GamepadPanel = require('./panels/Gamepad'),
    PerformancePanel = require('./panels/Performance');

/**
 * @class Phaser.Plugin.Debug
 * @classdesc Phaser - Debug Plugin
 *
 * @constructor
 * @extends Phaser.Plugin
 *
 * @param {Phaser.Game} game - A reference to the currently running game.
 * @param {Any} parent - The object that owns this plugin, usually Phaser.PluginManager.
 */
function Debug(game, parent) {
    Phaser.Plugin.call(this, game, parent);

    this.panels = {
        performance: null
    };

    this.timings = {
        game     : 0,
        gameTickStart: 0,
        gameLastTickStart: 0,

        state    : 0,
        stage    : 0,
        tweens   : 0,
        sound    : 0,
        input    : 0,
        physics  : 0,
        particles: 0,
        plugins  : 0
    };
};

//  Extends the Phaser.Plugin template, setting up values we need
Debug.prototype = Object.create(Phaser.Plugin.prototype);
Debug.prototype.constructor = Debug;

Debug.prototype.init = function () {
    // create the panels
    this.panels.map = new MapPanel(this.game, this);
    this.panels.sprites = new SpritesPanel(this.game, this);
    this.panels.gamepad = new GamepadPanel(this.game, this);
    this.panels.performance = new PerformancePanel(this.game, this);

    // wrap each component's update method so we can time it
    for (var p in this.timings) {
        this._wrap(this.game, p);
    }

    // wrap the game update method
    this._wrap(this, 'game');

    // initialize each panel
    for (var p in this.panels) {
        if (this.panels[p].init) {
            this.panels[p].init.apply(this.panels[p], arguments);
        }
    }
};

/**
 * Pre-update is called at the very start of the update cycle, before any other subsystems have been updated (including Physics).
 * It is only called if active is set to true.
 *
 * @method Phaser.Plugin.Debug#preUpdate
 */
// Debug.prototype.preUpdate = function () {
// };

/**
 * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
 * It is only called if active is set to true.
 *
 * @method Phaser.Plugin.Debug#update
 */
// Debug.prototype.update = function () {
// };

/**
 * Post-Update is called after all the update methods have already been called, but before the render calls.
 * It is only called if active is set to true.
 *
 * @method Phaser.Plugin.Debug#postUpdate
 */
Debug.prototype.postUpdate = function () {
    for (var p in this.panels) {
        if (this.panels[p].update) {
            this.panels[p].update();
        }
    }

    var fps = Math.round(1000 / (this.timings.gameTickStart - this.timings.gameLastTickStart)),
        dpf = this.game.renderer.renderSession.drawCount;

    fps = fps > 60 ? 60 : fps;

    // // update stats indicators
    // this.ui.setText(this._stats.dpf.firstElementChild, dpf === undefined ? 'N/A' : this._padString(dpf, 3));
    // this.ui.setText(this._stats.ms.firstElementChild, this._padString(this.timings.game.toFixed(0), 4));
    // this.ui.setText(this._stats.fps.firstElementChild, this._padString(fps.toFixed(0), 2));
};

/**
 * Render is called right after the Game Renderer completes, but before the State.render.
 * It is only called if visible is set to true.
 *
 * @method Phaser.Plugin.Debug#render
 */
// Debug.prototype.render = function () {
// };

/**
 * Post-render is called after the Game Renderer and State.render have run.
 * It is only called if visible is set to true.
 *
 * @method Phaser.Plugin.Debug#postRender
 */
// Debug.prototype.postRender = function () {
// };

/**
 * Marks a point on the performance graph with a label to help you corrolate events and timing on the graph
 *
 * @method Phaser.Plugin.Debug#mark
 */
Debug.prototype.mark = function (label) {
    if (this.panels.performance) {
        this.panels.performance.mark(label);
    }
};

Debug.prototype._wrap = function (obj, prop) {
    if (!obj[prop] || !obj[prop].update) return;

    obj[prop].update = (function(self, name, fn) {
        var start = 0,
            end = 0;

        return function () {
            start = Date.now();

            if (name === 'game') {
                self.timings.gameLastTickStart = self.timings.gameTickStart;
                self.timings.gameTickStart = start;
            }

            fn.apply(this, arguments);

            end = Date.now();

            self.timings[name] = end - start;
        };
    })(this, prop, obj[prop].update);
};

Debug.prototype._padString = function(str, to, pad) {
    if (pad === undefined) { pad = '0'; }

    while(str.length < to) {
        str = pad + str;
    }

    return str;
};
