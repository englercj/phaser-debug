import dom from '../../util/dom';

import TabPanel from './TabPanel';
import UI from '../UI';

export default class ScenePanel extends TabPanel {
    selected: PIXI.DisplayObjectContainer;
    selectedLi: HTMLLIElement;

    sidebar: HTMLUListElement;
    details: HTMLDivElement;

    constructor(ui: UI) {
        super(ui, 'Scene Tree');

        this.selected = null;
        this.selectedLi = null;

        this.sidebar = null;
        this.details = null;
    }

    render() {
        return super.render(
            this.sidebar = dom('ul', { className: 'sidebar' },
                this._renderTree(this.ui.plugin.game.stage)
            ),
            dom('a', {
                href: '#',
                className: 'refresh',
                textContent: 'refresh',
                onclick: (e: MouseEvent) => this._onRefreshClick(e),
            }),
            this.details = dom('div', { className: 'details' },
                this._renderDetails(this.selected)
            )
        );
    }

    destroy() {
        super.destroy();

        this.selected = null;
        this.selectedLi = null;

        this.sidebar = null;
        this.details = null;
    }

    private _renderTree(obj: PIXI.DisplayObjectContainer): HTMLLIElement {
        const className = obj.children && obj.children.length ? 'has-children' : '';
        const name = (<any>obj).name || (<any>obj).key;

        return dom('li', { className, onclick: (e: MouseEvent) => this._onTreeItemClick(e, obj) },
            dom.text(this._typeToString(obj)),
            name ? dom('span', { className: 'weak', textContent: ` (${name})` }) : null,
            obj.children && obj.children.length ?
                dom('ul', {},
                    obj.children.map((c: PIXI.DisplayObjectContainer) => {
                        return this._renderTree(c);
                    })
                )
            : null
        );
    }

    private _renderDetails(obj?: PIXI.DisplayObjectContainer) {
        if (!obj) { return []; }

        return [
            dom('br'),
            dom('br'),

            this._createValue('Name:', (<any>obj).name),
            this._createValue('Key:', (<any>obj).key),
            this._createValue('Type:', (<any>obj).typeString || this._typeToString(obj)),
            this._createValue('Visible:', obj.visible),
            this._createValue('Rotation:', obj.rotation),
            this._createValue('Alpha:', obj.alpha),
            this._createValue('Position:', `(${obj.position.x}, ${obj.position.y})`),
            this._createValue('Scale:', `(${obj.scale.x}, ${obj.scale.y})`),
            this._createValue('Size:', `(${obj.width}, ${obj.height})`),

            dom('hr'),

            this._createValue('World Visible:', obj.worldVisible),
            this._createValue('World Rotation:', obj.worldRotation),
            this._createValue('World Alpha:', obj.worldAlpha),
            this._createValue('World Position:', `(${obj.worldPosition.x}, ${obj.worldPosition.y})`),
            this._createValue('World Scale:', `(${obj.worldScale.x}, ${obj.worldScale.y})`),

            dom('hr'),

            obj.children && obj.children.length ? [
                this._createValue('Children:', obj.children.length),
                dom('br')
            ] : null,

            (<any>obj).texture ? [
                dom('label', { textContent: 'Texture:' }),
                (<any>obj).texture.baseTexture.source.src ?
                    dom('a', {
                        target: '_blank',
                        href: (<any>obj).texture.baseTexture.source.src,
                        textContent: (<any>obj).texture.baseTexture.source.src,
                    })
                    :
                    dom('strong', { textContent: (<any>obj).texture.baseTexture.source }),
                dom('br')
            ] : null,
        ];
    }

    private _createValue(label: string, value: any) {
        return [
            dom('label', { textContent: label }),
            dom('strong', { textContent: value }),
            dom('br'),
        ];
    }

    private _onRefreshClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        dom.empty(this.sidebar);
        dom.empty(this.details);
        this.sidebar.appendChild(this._renderTree(this.ui.plugin.game.stage));
    }

    private _onTreeItemClick(event: MouseEvent, obj: PIXI.DisplayObjectContainer) {
        event.stopPropagation();

        if (this.selectedLi) {
            this.selectedLi.classList.remove('selected');
        }

        this.selected = obj;
        this.selectedLi = <HTMLLIElement>event.currentTarget;

        this.selectedLi.classList.add('selected');
        this.selectedLi.classList.toggle('expanded');

        dom.empty(this.details);
        dom.appendChildren(this.details, this._renderDetails(obj));
    };

    private _typeToString(node: any) {
        // If no phaser type defined, try to guess
        if (node.type === undefined) {
            // Phaser.Stage does not have its 'type' property defined, so check here.
            if (node instanceof Phaser.Stage) {
                return 'Stage';
            }
            // PIXI.Stage was removed in Phaser 2.4.4, so make sure it's defined first.
            else if (typeof (<any>PIXI).Stage !== 'undefined' && node instanceof (<any>PIXI).Stage) {
                return 'PIXI Stage';
            }
            else if (node instanceof PIXI.Sprite) {
                return 'PIXI Sprite';
            }
            else if (node instanceof PIXI.DisplayObjectContainer) {
                return 'PIXI DisplayObjectContainer';
            }
            else if (node instanceof PIXI.DisplayObject) {
                return 'PIXI DisplayObject';
            }
            else {
                return 'Unknown';
            }
        }
        // return a string for the phaser type
        else {
            switch (node.type) {
                case Phaser.SPRITE:
                    return 'Sprite';

                case Phaser.BUTTON:
                    return 'Button';

                case Phaser.IMAGE:
                    return 'Image';

                case Phaser.GRAPHICS:
                    return 'Graphics';

                case Phaser.TEXT:
                    return 'Text';

                case Phaser.TILESPRITE:
                    return 'Tile Sprite';

                case Phaser.BITMAPTEXT:
                    return 'Bitmap Text';

                case Phaser.GROUP:
                    return 'Group';

                case Phaser.RENDERTEXTURE:
                    return 'Render Texture';

                case Phaser.TILEMAP:
                    return 'Tilemap';

                case Phaser.TILEMAPLAYER:
                    return 'Tilemap Layer';

                case Phaser.EMITTER:
                    return 'Emitter';

                case Phaser.POLYGON:
                    return 'Polygon';

                case Phaser.BITMAPDATA:
                    return 'Bitmap Data';

                case Phaser.CANVAS_FILTER:
                    return 'Canvas Filter';

                case Phaser.WEBGL_FILTER:
                    return 'WebGL Filter';

                case Phaser.ELLIPSE:
                    return 'Ellipse';

                case Phaser.SPRITEBATCH:
                    return 'Sprite Batch';

                case Phaser.RETROFONT:
                    return 'Retro Font';

                case Phaser.POINTER:
                    return 'Pointer';

                case Phaser.ROPE:
                    return 'Rope';

                default:
                    return 'Unknown';
            }
        }
    }
}
