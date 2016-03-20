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

    render(children?: HTMLElement) {
        return (this._element = children);
    }

    destroy() {
        this.ui = null;
        this._element = null;
    }
}
