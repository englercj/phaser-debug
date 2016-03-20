import dom from '../../util/dom';

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

    render(...children: HTMLElement[]) {
        return super.render(
            dom('div', { className: `pdebug-panel ${this.name}` },
                ...children
            )
        );
    }

    renderMenu() {
        return (this._menu =
            dom('a', {
                href: '#',
                className: `pdebug-menu-item ${this.name}`,
                textContent: this.title,
                onclick: (e: MouseEvent) => this._onMenuClick(e),
            })
        );
    }

    destroy() {
        super.destroy();

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
