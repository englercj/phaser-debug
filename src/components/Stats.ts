import dom from '../util/dom';

import Component from './Component';
import UI from './UI';

export default class Stats extends Component {
    ms: HTMLSpanElement;
    fps: HTMLSpanElement;
    dpf: HTMLSpanElement;

    constructor(ui: UI) {
        super(ui);

        this.ms = null;
        this.fps = null;
        this.dpf = null;
    }

    update() {
        const timings = this.ui.plugin.timings;
        const dpf = (<any>this.ui.plugin).game.renderer.renderSession.drawCount;
        let fps = Math.round(1000 / (timings.tick.start - timings.tick.lastStart));

        this.ms.textContent = Math.round(timings.tick.ms).toString();
        this.fps.textContent = Math.round(fps).toString();
        this.dpf.textContent = dpf === undefined ? '(N/A)' : dpf;
    }

    render(children?: HTMLElement) {
        return super.render(
            dom('span', { className: 'pdebug-stats' },
                dom('span', { className: 'pdebug-stats-item ms' },
                    this.ms = dom('span'),
                    dom.text(' ms')
                ),

                dom('span', { className: 'pdebug-stats-item fps' },
                    this.fps = dom('span'),
                    dom.text(' fps')
                ),

                dom('span', { className: 'pdebug-stats-item dpf' },
                    this.dpf = dom('span'),
                    dom.text(' draws')
                )
            )
        );
    }

    destroy() {
        super.destroy();

        this.ms = null;
        this.fps = null;
        this.dpf = null;
    }
}
