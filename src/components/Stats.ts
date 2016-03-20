import * as yo from 'yo-yo';

import Component from './Component';

export default class Stats extends Component {
    render(children?: HTMLElement) {
        const timings = this.ui.plugin.timings;
        const dpf = (<any>this.ui.plugin).game.renderer.renderSession.drawCount;
        let fps = Math.round(1000 / (timings.tick.start - timings.tick.lastStart));

        return super.render(yo`
            <span class="pdebug-stats">
                <span class="pdebug-stats-item ms">
                    <span>${Math.round(timings.tick.ms)}</span> ms
                </span>

                <span class="pdebug-stats-item fps">
                    <span>${Math.round(fps)}</span> fps
                </span>

                <span class="pdebug-stats-item dpf">
                    <span>${dpf === undefined ? '(N/A)' : dpf}</span> draws
                </span>
            </span>
        `);
    }
}
