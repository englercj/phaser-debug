import * as yo from 'yo-yo';

import Component from './Component';

export default class Stats extends Component {
    render(children?: HTMLElement) {
        const r = this.ui.plugin.game.renderType;
        const type = (r === Phaser.WEBGL ? 'WebGL' : (r === Phaser.HEADLESS ? 'Headless' : 'Canvas'));

        return super.render(yo`
            <span class="pdebug-head">
                Phaser Debug (${type}):
            </span>
        `);
    }
}
