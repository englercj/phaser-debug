import * as yo from 'yo-yo';

import TabPanel from './TabPanel';
import UI from '../UI';

export default class ScenePanel extends TabPanel {
    selected: PIXI.DisplayObjectContainer;
    selectedLi: HTMLElement;

    constructor(ui: UI) {
        super(ui, 'Scene Tree');

        this.selected = null;
        this.selectedLi = null;
    }

    render() {
        return super.render(yo`<div>
            <ul class="sidebar">
                ${this._renderTree(this.ui.plugin.game.stage)}
            </ul>
            <a href="#" class="refresh" onclick=${(e: MouseEvent) => this._onRefreshClick(e)}>
                refresh
            </a>
            <div class="details">
                ${this._renderDetails(this.selected)}
            </div>
        </div>`);
    }

    destroy() {
        super.destroy();

        this.selected = null;
        this.selectedLi = null;
    }

    private _renderTree(obj: PIXI.DisplayObjectContainer) {
        const className = obj.children && obj.children.length ? 'has-children' : '';

        return yo`
            <li class="${className}" onclick=${(e: MouseEvent) => this._onTreeItemClick(e, obj)}>
                ${this._typeToString(obj)}
                ${(<any>obj).name ? yo`<span class="weak">(${(<any>obj).name})</span>` : ''}
                ${obj.children && obj.children.length ?
                    yo`<ul>
                        ${obj.children.map((c: PIXI.DisplayObjectContainer) => {
                            this._renderTree(c);
                        })}
                    </ul>`
                : ''}
            </li>
        `;
    }

    private _renderDetails(obj?: PIXI.DisplayObjectContainer) {
        if (!obj) { return yo``; }

        return yo`<div>
            <br /><br />

            <label>Name:</label>
            <strong>${(<any>obj).name}</strong>
            <br />

            <label>Type:</label>
            <strong>${(<any>obj).typeString || this._typeToString(obj)}</strong>
            <br />

            <label>Visible:</label>
            <strong>${obj.visible}</strong>
            <br />

            <label>Rotation:</label>
            <strong>${obj.rotation}</strong>
            <br />

            <label>Position:</label>
            <strong>(${obj.position.x}</strong>, <strong>${obj.position.y})</strong>
            <br />

            <label>Scale:</label>
            <strong>(${obj.scale.x}</strong>, <strong>${obj.scale.y})</strong>
            <br />

            <label>Alpha:</label>
            <strong>${obj.alpha}</strong>
            <br />

            <hr />

            <label>World Visible:</label>
            <strong>${obj.worldVisible}</strong>
            <br />

            <label>World Rotation:</label>
            <strong>${obj.worldRotation}</strong>
            <br />

            <label>World Position:</label>
            <strong>(${obj.worldPosition.x}</strong>, <strong>${obj.worldPosition.y})</strong>
            <br />

            <label>World Scale:</label>
            <strong>(${obj.worldScale.x}</strong>, <strong>${obj.worldScale.y})</strong>
            <br />

            <label>World Alpha:</label>
            <strong>${obj.worldAlpha}</strong>
            <br />

            <hr />

            ${obj.children && obj.children.length ? yo`<div>
                <label>Children:</label>
                <strong>${obj.children.length}</strong>
                <br />
            </div>` : ''}

            ${(<any>obj).texture ? yo`<div>
                <label>Texture:</label>
                ${(<any>obj).texture.baseTexture.source.src ? yo`
                    <a href="${(<any>obj).texture.baseTexture.source.src}" target="_blank">
                        ${(<any>obj).texture.baseTexture.source.src}
                    </a>
                ` : yo`
                    <strong>${(<any>obj).texture.baseTexture.source}</strong>
                `}
                <br />
            </div>` : ''}
        </div>`;
    }

    private _onRefreshClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.updatePanel();
    }

    private _onTreeItemClick(event: MouseEvent, obj: PIXI.DisplayObjectContainer) {
        event.stopPropagation();

        if (this.selectedLi) {
            this.selectedLi.classList.remove('selected');
        }

        this.selected = obj;
        this.selectedLi = <HTMLElement>event.currentTarget;

        this.selectedLi.classList.add('selected');
        this.selectedLi.classList.toggle('expanded');

        this.updatePanel();
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
