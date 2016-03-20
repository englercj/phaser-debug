import dom from '../util/dom';

import Debug from '../index';

import Component from './Component';

import Header from './Header';
import Stats from './Stats';

import TabPanel from './tabs/TabPanel';
import PerformancePanel from './tabs/PerformancePanel';
import ScenePanel from './tabs/ScenePanel';

export default class UI extends Component {
    header: Header;
    stats: Stats;
    panels: TabPanel[];

    plugin: Debug;

    private _throttle: number;
    private _throttleCount: number;

    constructor(plugin: Debug) {
        super();

        this.plugin = plugin;

        this.header = new Header(this);
        this.stats = new Stats(this);
        this.panels = [
            new PerformancePanel(this),
            new ScenePanel(this),
        ];

        this._throttle = 2;
        this._throttleCount = 0;
    }

    deactivatePanels() {
        for (let i = 0; i < this.panels.length; ++i) {
            this.panels[i].deactivate();
        }
    }

    update() {
        for (let i = 0; i < this.panels.length; ++i) {
            if (this.panels[i].active) {
                this.panels[i].update();
            }
        }

        if (this._throttleCount++ % this._throttle === 0) {
            this.stats.update();
        }
    }

    render(children?: HTMLElement) {
        return super.render(
            dom('div', { className: 'pdebug' },
                dom('div', { className: 'pdebug-menu' },
                    this.header.render(),
                    this.stats.render(),
                    this.panels.map((panel: TabPanel) => {
                        return panel.renderMenu();
                    })
                ),
                this.panels.map((panel: TabPanel) => {
                    return panel.render();
                })
            )
        );
    }

    destroy() {
        super.destroy();

        this.header.destroy();
        this.stats.destroy();

        for (let i = 0; i < this.panels.length; ++i) {
            this.panels[i].destroy();
        }

        this.plugin = null;
        this.header = null;
        this.panels = null;
    }
}
