/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

type TTable<T> = { [key: string]: T };

interface IPanelsTable {
    performance: any;
    scene: any;
}

interface ITickTimings {
    lastStart: number;
    start: number;
    ms: number;
}

interface ITimings {
    [key: string]: { [key: string]: number };
}

interface IStats {
    ms: HTMLElement;
    fps: HTMLElement;
    dpf: HTMLElement;
    ent: HTMLElement;
}

// Yo-Yo
declare const yo: {
    (str: string, ...args: any[]): HTMLElement;
    update: (target: HTMLElement, newElm: HTMLElement) => HTMLElement;
};

declare module 'yo-yo' {
    export = yo;
}

