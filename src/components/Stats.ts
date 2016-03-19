import * as yo from 'yo-yo';

import Component from './Component';

export default class Stats extends Component {
    render(children?: HTMLElement) {
        const dpf = (<any>this.ui.plugin.game.renderer.renderSession).drawCount;
        let fps = Math.round(1000 / (this.ui.plugin.tickTimings.start - this.ui.plugin.tickTimings.lastStart));

        fps = fps > 60 ? 60 : fps;

        return super.render(yo`
            <span class="pdebug-stats">
                <span class="pdebug-stats-item ms">
                    <span>${Math.round(this.ui.plugin.tickTimings.ms)}</span> ms
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
