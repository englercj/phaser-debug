import * as yo from 'yo-yo';

import Component from '../Component';
import UI from '../UI';

export default class TabPanel extends Component {
    name: string;
    title: string;

    active: boolean;

    private _menu: HTMLElement;

    constructor(ui: UI, title: string) {
        super(ui);

        this.name = title.toLowerCase().replace(' ', '_');
        this.title = title;

        this.active = false;

        this._element = null;
        this._menu = null;
    }

    get panel() { return this._element; }
    get menu() { return this._menu; }

    activate() {
        this.ui.deactivatePanels();

        this.active = true;

        if (this._menu) {
            this._menu.classList.add('active');
        }

        if (this._element) {
            this._element.classList.add('active');
        }
    }

    deactivate() {
        this.active = false;

        if (this._menu) {
            this._menu.classList.remove('active');
        }

        if (this._element) {
            this._element.classList.remove('active');
        }
    }

    render(children?: HTMLElement) {
        return super.render(yo`
            <div class="pdebug-panel ${this.name} ${this.active ? 'active' : ''}">
                ${children}
            </div>
        `);
    }

    renderMenu() {
        return (this._menu = yo`
            <a href="#" class="pdebug-menu-item ${this.name}" onclick=${(e: MouseEvent) => this._onMenuClick(e)}>
                ${this.title}
            </a>
        `);
    }

    destroy() {
        this.name = '';
        this.title = '';

        this.active = false;
        this._menu = null;
    }

    private _onMenuClick(event: MouseEvent) {
        event.preventDefault();

        if (this.active) {
            this.deactivate();
        }
        else {
            this.activate();
        }
    }
}
