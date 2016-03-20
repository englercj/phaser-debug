import * as yo from 'yo-yo';

import UI from './components/UI';
import Timings from './util/Timings';

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
    timings: Timings;

    private _ui: UI;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObject) {
        super(game, parent);


        this.timings = new Timings(this);

        this._ui = null;
    }

    init() {
        this._ui = new UI(this);
        document.body.appendChild(this._ui.render());
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

        this._ui.destroy();
        this.timings.destroy();

        this.timings = null;

        this._ui = null;
    }
}
