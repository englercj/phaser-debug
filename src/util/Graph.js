function Graph(container, width, height, colors, options) {
    options = options || {};

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.label = 'ms';
    this.labelPrecision = 0;
    this.labelStyle = 'rgba(200, 200, 200, 0.6)';

    this.maxValue = options.maxValue || 50;
    this.padding = options.labelPadding || 5;

    this.dataLineWidth = options.lineWidth || 1;
    this.legendWidth = 230;
    this.legendBoxSize = 10;
    this.legendIndent = 10;

    this.colors = colors;

    this.dataCanvas = document.createElement('canvas');
    this.dataCanvas.width = width - this.legendWidth;
    this.dataCanvas.height = height;
    this.dctx = this.dataCanvas.getContext('2d');

    this.dataCanvasBuffer = document.createElement('canvas');
    this.dataCanvasBuffer.width = this.dataCanvas.width - this.dataLineWidth;
    this.dataCanvasBuffer.height = this.dataCanvas.height;
    this.bctx = this.dataCanvasBuffer.getContext('2d');
};

Graph.prototype.constructor = Graph;

module.exports = Graph;

// render the graph with the new data point
Graph.prototype.addData = function (values) {
    // clear the main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBg();
    this.drawLegend(values);
    this.drawData(values);
};

Graph.prototype.drawBg = function () {
    var step = this.canvas.height / 3;

    this.ctx.strokeStyle = this.ctx.fillStyle = this.labelStyle;

    //draw top marker line
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, step);
    this.ctx.lineTo(this.canvas.width, step);
    this.ctx.stroke();

    //draw the second marker line
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, step*2);
    this.ctx.lineTo(this.canvas.width, step*2);
    this.ctx.stroke();

    //draw baseline marker
    this.ctx.beginPath();
    this.ctx.moveTo(this.legendWidth, this.canvas.height);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.stroke();

    //draw marker line text
    this.ctx.fillText(((this.maxValue / 3)*2).toFixed(this.labelPrecision) + this.label, this.legendWidth + this.padding, step-this.padding);
    this.ctx.fillText((this.maxValue / 3).toFixed(this.labelPrecision) + this.label, this.legendWidth + this.padding, (step*2)-this.padding);
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

        ++yIndex

        // Draw children
        for (var c in values[k]) {
            y = (yIndex * this.legendBoxSize) + (this.padding * yIndex);

            this.ctx.fillStyle = this.colors[colorIndex++ % this.colors.length];
            this.ctx.fillRect(x + this.legendIndent, y, this.legendBoxSize, this.legendBoxSize);

            this.ctx.fillStyle = this.labelStyle;
            this.ctx.fillText(Math.round(values[k][c]) + 'ms - ' + c, x + this.legendIndent + this.legendBoxSize + this.padding, y + this.legendBoxSize);

            ++yIndex;

            if (yIndex > 16) {
                x += this.legendWidth / 2;
                yIndex = 0;
            }
        }
    }
};

Graph.prototype.drawData = function (values) {
    var x = this.dataCanvas.width - this.dataLineWidth,
        y = this.dataCanvas.height;

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

    // draws the data values to the new line of the data canvas

    // draw the new data points
    var colorIndex = 0,
        step = 0;

    for (var k in values) {
        for (var c in values[k]) {
            this.dctx.beginPath();
            this.dctx.strokeStyle = this.dctx.fillStyle = this.colors[colorIndex++ % this.colors.length]
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
