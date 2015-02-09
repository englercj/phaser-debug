// TODO: Move the legend into DOM?

function Graph(container, width, height, colors, options) {
    options = options || {};

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

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

Graph.prototype.constructor = Graph;

module.exports = Graph;

// render the graph with the new data point
Graph.prototype.addData = function (values, event) {
    // clear the main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBg();
    this.drawLegend(values);
    this.drawData(values, event);
};

Graph.prototype.drawBg = function () {
    var fps60 = Math.floor(this.canvas.height - (this.canvas.height * (16 / this.maxValue))) + 0.5,
        fps30 = Math.floor(this.canvas.height - (this.canvas.height * (33 / this.maxValue))) + 0.5;

    this.ctx.strokeStyle = this.ctx.fillStyle = this.labelStyle;
    this.ctx.lineWidth = 1;

    //draw top marker line
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, fps60);
    this.ctx.lineTo(this.canvas.width, fps60);
    this.ctx.stroke();

    this.ctx.fillText('16ms (60 fps)', this.legendWidth + this.padding, fps60 - this.padding);

    //draw the second marker line
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, fps30);
    this.ctx.lineTo(this.canvas.width, fps30);
    this.ctx.stroke();

    this.ctx.fillText('33ms (30 fps)', this.legendWidth + this.padding, fps30 - this.padding);

    //draw baseline marker
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, this.canvas.height - 0.5);
    this.ctx.lineTo(this.canvas.width, this.canvas.height - 0.5);
    this.ctx.stroke();
};

Graph.prototype.drawLegend = function (values) {
    var colorIndex = 0,
        yIndex = 0,
        x = this.padding,
        y = 0;

    for (var k in values) {
        y = (yIndex * this.legendBoxSize) + (this.padding * (yIndex + 1)) + this.padding;

        // Draw parent label
        this.ctx.fillStyle = this.labelStyle;
        this.ctx.fillText(k, x, y);

        ++yIndex;

        // Draw children
        for (var c in values[k]) {
            y = (yIndex * this.legendBoxSize) + (this.padding * yIndex);

            this.ctx.fillStyle = this.colors[colorIndex++ % this.colors.length];
            this.ctx.fillRect(x + this.legendIndent, y, this.legendBoxSize, this.legendBoxSize);

            this.ctx.fillStyle = this.labelStyle;
            this.ctx.fillText(
                Math.round(values[k][c]) + 'ms - ' + c,
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
};

Graph.prototype.drawData = function (values, event) {
    var x = this.dataCanvas.width - this.dataLineWidth + 0.5,
        y = this.dataCanvas.height - 0.5;

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
    var colorIndex = 0,
        step = 0;

    for (var k in values) {
        for (var c in values[k]) {
            this.dctx.beginPath();
            this.dctx.strokeStyle = this.dctx.fillStyle = this.colors[colorIndex++ % this.colors.length];
            this.dctx.lineWidth = this.dataLineWidth;

            step = ((values[k][c] / this.maxValue) * this.dataCanvas.height);
            step = step < 0 ? 0 : step;

            this.dctx.moveTo(x, y);
            this.dctx.lineTo(x, y-=step);

            this.dctx.stroke();
        }
    }

    // draw the data canvas to the main rendered canvas
    this.ctx.drawImage(this.dataCanvas, this.legendWidth, 0);
};

Graph.prototype.destroy = function () {
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
