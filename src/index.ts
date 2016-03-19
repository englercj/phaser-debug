import * as yo from 'yo-yo';

import UI from './components/UI';

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
export default class Debug extends Phaser.Plugin {
    timer: (Performance | DateConstructor);
    tickTimings: ITickTimings;
    timings: ITimings;

    private _stats: IStats;

    private _ui: UI;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObject) {
        super(game, parent);

        this.timer = (window.performance ? window.performance : Date);

        this.tickTimings = {
            lastStart: 0,
            start: 0,
            ms: 0,
        };

        this.timings = {
            preUpdate: {
                physics  : 0,
                state    : 0,
                plugins  : 0,
                stage    : 0,
            },
            update: {
                state    : 0,
                stage    : 0,
                tweens   : 0,
                sound    : 0,
                input    : 0,
                physics  : 0,
                particles: 0,
                plugins  : 0,
            },
            postUpdate: {
                stage    : 0,
                plugins  : 0,
            },
            preRender: {
                state    : 0,
            },
            render: {
                renderer : 0,
                plugins  : 0,
                state    : 0,
            },
            postRender: {
                plugins  : 0,
            },
        };

        this._stats = {
            ms: null,
            fps: null,
            dpf: null,
            ent: null,
        };

        this._ui = null;
    }

    init() {
        this._ui = new UI(this);
        document.body.appendChild(this._ui.render());

        // wrap each component's update methods so we can time them
        for (let method in this.timings) {
            for (let comp in this.timings[method]) {
                this._wrap(this.game, comp, method, comp);
            }
        }

        // wrap the game update method
        this._wrap(this, 'game', 'update');
    }

    /**
     * Post-Update is called after all the update methods have already been called, but before the render calls.
     * It is only called if active is set to true.
     */
    postUpdate() {
        this._ui.update();
    }

    /**
     * Marks a point on the performance graph with a label to help you corrolate events and timing on the graph
     */
    // mark(label) {
    //     if (this.panels.performance) {
    //         this.panels.performance.mark(label);
    //     }
    // }

    /**
     * Cleans up the plugin data, and destroys the panels.
     */
    destroy() {
        super.destroy();

        this.timer = null;
        this.tickTimings = null;
        this.timings = null;

        this._stats = null;

        this._ui = null;
    }

    private _wrap(obj: any, component: string, componentMethod: string, timingStat?: string) {
        if (!obj[component] || !obj[component][componentMethod]) {
            return;
        }

        obj[component][componentMethod] = (function(self: any, name: string, method: string, stat: string, fn: Function) {
            let start = 0;
            let end = 0;

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
        })(this, component, componentMethod, timingStat, obj[component][componentMethod]);
    }
}
