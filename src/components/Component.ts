import * as yo from 'yo-yo';

import UI from './UI';

export default class Component {
    ui: UI;

    protected _element: HTMLElement;

    constructor(ui: UI = null) {
        this.ui = ui;

        this._element = null;
    }

    get element() { return this._element; }

    update() { /* abstract */ }

    updatePanel() {
        let element = this._element;
        yo.update(element, this.render());
        this._element = element;
    }

    render(children?: HTMLElement) {
        return (this._element = children);
    }

    destroy() {
        this.ui = null;
        this._element = null;
    }
}
