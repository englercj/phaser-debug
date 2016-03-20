import dom from '../util/dom';

import Component from './Component';

export default class Stats extends Component {
    render(children?: HTMLElement) {
        const r = this.ui.plugin.game.renderType;
        const type = (r === Phaser.WEBGL ? 'WebGL' : (r === Phaser.HEADLESS ? 'Headless' : 'Canvas'));

        return super.render(
            dom('span', { className: 'pdebug-head' },
                dom.text(`Phaser Debug (${type})`)
            )
        );
    }
}
