var ui = require('./util/ui'),
    css = require('./styles/main.less'),
    PerformancePanel = require('./panels/Performance'),
    ScenePanel = require('./panels/Scene');

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
        performance: null,
        scene: null
    };

    this.tickTimings = {
        lastStart: 0,
        start: 0,
        ms: 0
    };

    this.timings = {
        preUpdate: {
            physics  : 0,
            state    : 0,
            plugins  : 0,
            stage    : 0
        },
        update: {
            state    : 0,
            stage    : 0,
            tweens   : 0,
            sound    : 0,
            input    : 0,
            physics  : 0,
            particles: 0,
            plugins  : 0
        },
        postUpdate: {
            stage    : 0,
            plugins  : 0
        },
        preRender: {
            state    : 0
        },
        render: {
            renderer : 0,
            plugins  : 0,
            state    : 0
        },
        postRender: {
            plugins  : 0
        }
    };

    this._container = null;
    this._bar = null;

    this._stats = {
        ms: null,
        fps: null,
        dpf: null,
        ent: null
    };

    this.timer = (window.performance ? window.performance : Date);
}

//  Extends the Phaser.Plugin template, setting up values we need
Debug.prototype = Object.create(Phaser.Plugin.prototype);
Debug.prototype.constructor = Debug;

Debug.PKG = require('../package.json');
Debug.VERSION = Debug.PKG.version;

module.exports = Debug;

Debug.prototype.init = function () {
    // create the panels
    this.panels.performance = new PerformancePanel(this.game, this);
    this.panels.scene = new ScenePanel(this.game, this);

    // add elements to the page
    ui.addCss(css);
    document.body.appendChild(this._createElement());

    this._bindEvents();

    // wrap each component's update methods so we can time them
    for (var method in this.timings) {
        for (var comp in this.timings[method]) {
            this._wrap(this.game, comp, method, comp);
        }
    }

    // wrap the game update method
    this._wrap(this, 'game', 'update');

    // initialize each panel
    for (var p in this.panels) {
        if (this.panels[p].init) {
            this.panels[p].init.apply(this.panels[p], arguments);
        }
    }
};

/**
 * Post-Update is called after all the update methods have already been called, but before the render calls.
 * It is only called if active is set to true.
 *
 * @method Phaser.Plugin.Debug#postUpdate
 */
Debug.prototype.postUpdate = function () {
    for (var p in this.panels) {
        if (this.panels[p].update && this.panels[p].active) {
            this.panels[p].update();
        }
    }

    var fps = Math.round(1000 / (this.tickTimings.start - this.tickTimings.lastStart)),
        dpf = this.game.renderer.renderSession.drawCount;

    fps = fps > 60 ? 60 : fps;

    // update stats indicators
    ui.setText(this._stats.dpf.firstElementChild, dpf === undefined ? '(N/A)' : dpf, 3);
    ui.setText(this._stats.ms.firstElementChild, Math.round(this.tickTimings.ms), 4);
    ui.setText(this._stats.fps.firstElementChild, Math.round(fps), 2);
};

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

Debug.prototype.destroy = function () {
    Phaser.Plugin.prototype.destroy.call(this);

    for (var p in this.panels) {
        this.panels[p].destroy();
    }

    this.panels = null;
    this.tickTimings = null;
    this.timings = null;

    this._container = null;
    this._bar = null;
    this._stats = null;

    this.timer = null;
};

Debug.prototype._wrap = function (obj, component, method, timingStat) {
    if (!obj[component] || !obj[component][method]) {
        return;
    }

    obj[component][method] = (function(self, name, method, stat, fn) {
        var start = 0,
            end = 0;

        // special tick capture for game update
        if (name === 'game' && method === 'update' && !stat) {
            return function () {
                start = self.timer.now();

                self.tickTimings.lastStart = self.tickTimings.start;
                self.tickTimings.start = start;

                fn.apply(this, arguments);

                end = self.timer.now();

                self.tickTimings.ms = end - start;
            };
        }
        else {
            return function () {
                start = self.timer.now();

                fn.apply(this, arguments);

                end = self.timer.now();

                self.timings[method][stat] = end - start;
            };
        }
    })(this, component, method, timingStat, obj[component][method]);
};

Debug.prototype._bindEvents = function () {
    var activePanel,
        self = this;

    ui.on(this._bar, 'click', '.pdebug-menu-item', function(e) {
        e.preventDefault();

        var panel = self.panels[e.target.getAttribute('href').replace('#', '')];

        if(!panel) {
            return;
        }

        if(activePanel) {
            activePanel.toggle();
            ui.removeClass(activePanel._menuItem, 'active');

            if(activePanel.name === panel.name) {
                activePanel = null;
                return;
            }
        }

        ui.addClass(e.target, 'active');
        panel.toggle();
        activePanel = panel;
    });
};

Debug.prototype._createElement = function () {
    var c = this._container = document.createElement('div'),
        bar = this._bar = document.createElement('div');

    //container
    ui.addClass(c, 'pdebug');
    c.appendChild(bar);

    //the menu bar
    ui.addClass(bar, 'pdebug-menu');
    bar.appendChild(this._createMenuHead());
    bar.appendChild(this._createMenuStats());

    //add the panels
    for(var p in this.panels) {
        bar.appendChild(this.panels[p].createMenuElement());
        c.appendChild(this.panels[p].createPanelElement());
    }

    return c;
};

Debug.prototype._createMenuHead = function () {
    var div = document.createElement('span'),
        r = this.game.renderType,
        type = (r === Phaser.WEBGL ? 'WebGL' : (r === Phaser.HEADLESS ? 'Headless' : 'Canvas'));

    ui.addClass(div, 'pdebug-head');
    ui.setText(div, 'Phaser Debug (' + type + '):');

    return div;
};

Debug.prototype._createMenuStats = function () {
    var div = document.createElement('div');

    ui.addClass(div, 'pdebug-stats');

    this._stats.ms = document.createElement('span');
    this._stats.fps = document.createElement('span');
    this._stats.dpf = document.createElement('span');
    // this._stats.ent = document.createElement('span');

    ui.addClass(this._stats.ms, 'pdebug-stats-item ms');
    ui.setHtml(this._stats.ms, '<span>0</span> ms');
    div.appendChild(this._stats.ms);

    ui.addClass(this._stats.fps, 'pdebug-stats-item fps');
    ui.setHtml(this._stats.fps, '<span>0</span> fps');
    div.appendChild(this._stats.fps);

    ui.addClass(this._stats.dpf, 'pdebug-stats-item dpf');
    ui.setHtml(this._stats.dpf, '<span>0</span> draws');
    div.appendChild(this._stats.dpf);

    // ui.addClass(this._stats.ent, 'pdebug-stats-item ent');
    // ui.setHtml(this._stats.ent, '<span>0</span> entities');
    // div.appendChild(this._stats.ent);

    return div;
};
