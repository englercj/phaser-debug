function Graph(container, width, height, dataStyles, options) {
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
    this.legendWidth = 115;

    this.styles = dataStyles || {};

    if(!this.styles._default) {
        this.styles._default = 'red';
    }

    if(!this.styles.event) {
        this.styles.event = 'gray';
    }

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
    var ctx = this.ctx,
        minX = this.legendWidth,
        maxX = this.canvas.width,
        maxY = this.canvas.height,
        step = maxY / 3;

    ctx.strokeStyle = ctx.fillStyle = this.labelStyle;

    //draw top marker line
    ctx.beginPath();
    ctx.moveTo(minX, step);
    ctx.lineTo(maxX, step);
    ctx.stroke();

    //draw the second marker line
    ctx.beginPath();
    ctx.moveTo(minX, step*2);
    ctx.lineTo(maxX, step*2);
    ctx.stroke();

    //draw baseline marker
    ctx.beginPath();
    ctx.moveTo(minX, maxY);
    ctx.lineTo(maxX, maxY);
    ctx.stroke();

    //draw marker line text
    ctx.fillText(((this.max / 3)*2).toFixed(this.labelPrecision) + this.label, minX + this.padding, step-this.padding);
    ctx.fillText((this.max / 3).toFixed(this.labelPrecision) + this.label, minX + this.padding, (step*2)-this.padding);
};

Graph.prototype.drawLegend = function (values) {
    var ctx = this.ctx,
        i = 0,
        box = 10,
        pad = this.padding,
        lbl = this.labelStyle;

    for(var k in this.styles) {
        var style = this.styles[k],
            y = (box * i) + (pad * (i+1)),
            val = typeof values[k] === 'number' ? values[k].toFixed(2) : null,
            text = k + (val ? ' (' + val + ' ms)' : '');

        ctx.fillStyle = style;
        ctx.fillRect(pad, y, box, box);
        ctx.fillStyle = lbl;
        ctx.fillText(text, pad + box + pad, y + box);

        i++;
    }
};

Graph.prototype.drawData = function (values) {
    var x = this.dataCanvas.width - this.dataLineWidth,
        y = this.dataCanvas.height,
        step = 0;

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

    // draw the new data point
    for(var k in values) {
        this.dctx.beginPath();
        this.dctx.strokeStyle = this.dctx.fillStyle = this.styles[k] || this.styles._default;
        this.dctx.lineWidth = this.dataLineWidth;

        if (k === 'event') {
            if (values[k] == null) continue;

            this.dctx.moveTo(x, 0);
            this.dctx.lineTo(x, this.dataCanvas.height);
            this.dctx.fillText(values[k], x + this.padding, (this.padding * 2));
        }
        else {
            step = ((values[k] / this.max) * this.dataCanvas.height);
            step = step < 0 ? 0 : step;

            this.dctx.moveTo(x, y);
            this.dctx.lineTo(x, y-=step);
        }

        this.dctx.stroke();
    }

    this.ctx.drawImage(this.dataCanvas, this.legendWidth, 0);
};
