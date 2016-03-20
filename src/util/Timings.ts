import Debug from '../index';

enum KEYS {
    physics_preUpdate,
    physics_update,

    state_preUpdate,
    state_update,
    state_preRender,
    state_render,

    stage_preUpdate,
    stage_update,
    stage_postUpdate,

    plugins_preUpdate,
    plugins_update,
    plugins_postUpdate,
    plugins_render,
    plugins_postRender,

    tweens_update,

    sound_update,

    input_update,

    particles_update,

    renderer_render,

    _count
};

interface ITimedComponent {
    component: string;
    method: string;
    index: number;
}

const keyNames = Object.keys(KEYS).filter((v: string) => isNaN(parseInt(v, 10)));

export const TimedComponents: ITimedComponent[] = [];

keyNames.forEach((key) => {
    if (key === '_count')  { return; }

    const parts = key.split('_');
    TimedComponents.push({
        component: parts[0],
        method: parts[1],
        index: (<any>KEYS)[key],
    });
});

export default class Timings {
    data: number[];
    tick: ITickTimings;
    timer: (Performance | DateConstructor);

    constructor(plugin: Debug) {
        this.data = new Array(KEYS._count);

        this.tick = {
            lastStart: 0,
            start: 0,
            ms: 0,
        };

        this.timer = (window.performance ? window.performance : Date);

        // initialize data
        for (let i = 0; i < KEYS._count; ++i) {
            this.data[i] = 0;
        }

        // wrap methods
        for (let i = 0; i < TimedComponents.length; ++i) {
            const comp = TimedComponents[i];
            this._wrap(plugin.game, comp.component, comp.method, comp.index);
        }

        this._wrap(plugin, 'game', 'update');
    }

    destroy() {
        this.data = null;
        this.tick = null;
        this.timer = null;
    }

    private _wrap(obj: any, component: string, componentMethod: string, index?: number) {
        if (!obj[component] || !obj[component][componentMethod]) {
            return;
        }

        const originalFn = obj[component][componentMethod];
        const self = this;

        let start = 0;
        let end = 0;
        let handler: Function;

        // special tick capture for game update
        if (component === 'game' && componentMethod === 'update' && !index) {
            handler = function () {
                start = self.timer.now();

                self.tick.lastStart = self.tick.start;
                self.tick.start = start;

                originalFn.apply(this, arguments);

                end = self.timer.now();

                self.tick.ms = end - start;
            };
        }
        else {
            handler = function () {
                start = self.timer.now();

                originalFn.apply(this, arguments);

                end = self.timer.now();

                self.data[index] = end - start;
            };
        }

        obj[component][componentMethod] = handler;
    }
}
