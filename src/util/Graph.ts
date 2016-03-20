import {default as Timings, TimedComponents} from './Timings';

export default class Graph {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    labelStyle: string;

    maxValue: number;
    padding: number;

    dataLineWidth: number;
    legendWidth: number;
    legendBoxSize: number;
    legendIndent: number;

    eventY: number;

    colors: string[];

    dataCanvas: HTMLCanvasElement;
    dctx: CanvasRenderingContext2D;

    dataCanvasBuffer: HTMLCanvasElement;
    bctx: CanvasRenderingContext2D;

    constructor(width: number, height: number, colors: string[], options?: any) {
        options = options || {};

        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = this.canvas.getContext('2d');

        this.labelStyle = 'rgba(200, 200, 200, 0.6)';

        this.maxValue = options.maxValue || 50;
        this.padding = options.labelPadding || 5;

        this.dataLineWidth = options.lineWidth || 1;
        this.legendWidth = 230;
        this.legendBoxSize = 10;
        this.legendIndent = 5;

        this.eventY = this.padding * 2;

        this.colors = colors;

        this.dataCanvas = document.createElement('canvas');
        this.dataCanvas.width = width - this.legendWidth;
        this.dataCanvas.height = height;
        this.dctx = this.dataCanvas.getContext('2d');

        this.dataCanvasBuffer = document.createElement('canvas');
        this.dataCanvasBuffer.width = this.dataCanvas.width - this.dataLineWidth;
        this.dataCanvasBuffer.height = this.dataCanvas.height;
        this.bctx = this.dataCanvasBuffer.getContext('2d');
    }

    get element() { return this.canvas; }

    // render the graph with the new data point
    addData(values: Timings, event?: any) {
        // clear the main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBg();
        this.drawLegend(values);
        this.drawData(values, event);
    }

    drawBg() {
        const fps60 = Math.floor(this.canvas.height - (this.canvas.height * (16 / this.maxValue))) + 0.5;
        const fps30 = Math.floor(this.canvas.height - (this.canvas.height * (33 / this.maxValue))) + 0.5;

        this.ctx.strokeStyle = this.ctx.fillStyle = this.labelStyle;
        this.ctx.lineWidth = 1;

        // draw top marker line
        this.ctx.beginPath();
        this.ctx.moveTo(this.legendWidth, fps60);
        this.ctx.lineTo(this.canvas.width, fps60);
        this.ctx.stroke();

        this.ctx.fillText('16ms (60 fps)', this.legendWidth + this.padding, fps60 - this.padding);

        // draw the second marker line
        this.ctx.beginPath();
        this.ctx.moveTo(this.legendWidth, fps30);
        this.ctx.lineTo(this.canvas.width, fps30);
        this.ctx.stroke();

        this.ctx.fillText('33ms (30 fps)', this.legendWidth + this.padding, fps30 - this.padding);

        // draw baseline marker
        this.ctx.beginPath();
        this.ctx.moveTo(this.legendWidth, this.canvas.height - 0.5);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 0.5);
        this.ctx.stroke();
    };

    drawLegend(timings: Timings) {
        // TODO: Optimize by caching the position calculations done here
        // no need to redo them everytime we draw this legend
        let colorIndex = 0;
        let yIndex = 0;
        let x = this.padding;
        let y = 0;
        let lastComponent = '';

        for (let i = 0; i < TimedComponents.length; ++i) {
            const comp = TimedComponents[i];

            if (lastComponent !== comp.component) {
                y = (yIndex * this.legendBoxSize) + (this.padding * (yIndex + 1)) + this.padding;

                // Draw parent label
                this.ctx.fillStyle = this.labelStyle;
                this.ctx.fillText(comp.component, x, y);

                ++yIndex;
                lastComponent = comp.component;
            }

            y = (yIndex * this.legendBoxSize) + (this.padding * yIndex);

            this.ctx.fillStyle = this.colors[colorIndex++ % this.colors.length];
            this.ctx.fillRect(x + this.legendIndent, y, this.legendBoxSize, this.legendBoxSize);

            this.ctx.fillStyle = this.labelStyle;
            this.ctx.fillText(
                Math.round(timings.data[comp.index]) + 'ms - ' + comp.method,
                x + this.legendIndent + this.legendBoxSize + this.padding,
                y + this.legendBoxSize
            );

            ++yIndex;

            if (yIndex > 16) {
                x += this.legendWidth / 2;
                yIndex = 0;
            }
        }
    }

    drawData(timings: Timings, event?: any) {
        let x = this.dataCanvas.width - this.dataLineWidth + 0.5;
        let y = this.dataCanvas.height - 0.5;

        // clear the buffer
        this.bctx.clearRect(0, 0, this.dataCanvasBuffer.width, this.dataCanvasBuffer.height);

        // draw the data canvas to the buffer, skipping the first line
        this.bctx.drawImage(
            this.dataCanvas,
            this.dataLineWidth, 0, x, y,
            0, 0, x, y
        );

        // clear the data canvas
        this.dctx.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);

        // draw the buffer back to the data canvas
        this.dctx.drawImage(this.dataCanvasBuffer, 0, 0);

        // draw event to the new line of the data canvas if there was one
        if (event) {
            this.dctx.beginPath();
            this.dctx.strokeStyle = this.dctx.fillStyle = '#ff0000';
            this.dctx.lineWidth = this.dataLineWidth;

            this.dctx.moveTo(x, y);
            this.dctx.lineTo(x, 0);

            this.dctx.stroke();

            this.dctx.textAlign = 'right';
            this.dctx.fillText(event, x - this.padding, this.eventY);

            this.eventY += (this.padding * 2);

            if (this.eventY > (this.dataCanvas.height / 2)) {
                this.eventY = (this.padding * 2);
            }
        }

        // draws the data values to the new line of the data canvas

        // draw the new data points
        let step = 0;

        for (let i = 0; i < timings.data.length; ++i) {
            this.dctx.beginPath();
            this.dctx.strokeStyle = this.dctx.fillStyle = this.colors[i % this.colors.length];
            this.dctx.lineWidth = this.dataLineWidth;

            step = ((timings.data[i] / this.maxValue) * this.dataCanvas.height);
            step = step < 0 ? 0 : step;

            this.dctx.moveTo(x, y);
            this.dctx.lineTo(x, y -= step);

            this.dctx.stroke();
        }

        // draw the data canvas to the main rendered canvas
        this.ctx.drawImage(this.dataCanvas, this.legendWidth, 0);
    };

    destroy() {
        this.canvas = null;
        this.ctx = null;

        this.labelStyle = null;

        this.maxValue = null;
        this.padding = null;

        this.dataLineWidth = null;
        this.legendWidth = null;
        this.legendBoxSize = null;
        this.legendIndent = null;

        this.colors = null;

        this.dataCanvas = null;
        this.dctx = null;

        this.dataCanvasBuffer = null;
        this.bctx = null;
    };

}
