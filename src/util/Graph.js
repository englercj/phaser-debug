function Graph(container, width, height, dataStyles) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.label = 'ms';
    this.labelPrecision = 0;
    this.labelStyle = 'rgba(200, 200, 200, 0.6)';

    this.maxValue = 50;
    this.padding = 5;

    this.dataLineWidth = 1;
    this.legendWidth = 115;

    this.styles = dataStyles || {};

    if(!this.styles._default) {
        this.styles._default = 'red';
    }

    if(!this.styles.event) {
        this.styles.event = 'gray';
    }

    this.gbuffer = document.createElement('canvas');
    this.gbuffer.width = width - this.dataLineWidth - this.legendWidth;
    this.gbuffer.height = height;
    this.gctx = this.gbuffer.getContext('2d');
};

Graph.prototype.constructor = Graph;

// render the graph with the new data point
Graph.prototype.addData = function (values) {
    // store the graph to the buffer, skipping the first line
    this.gctx.clearRect(0, 0, this.gbuffer.width, this.gbuffer.height);
    this.gctx.drawImage(
        this.canvas,
        this.legendWidth + this.dataLineWidth,
        0,
        this.gbuffer.width,
        this.gbuffer.height,
        0,
        0,
        this.gbuffer.height,
        this.gbuffer.height
    );

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
    // draw the data buffer back down, this gives the effect of "shifting" it to the left by 1
    this.ctx.drawImage(this.gbuffer, this.legendWidth, 0);

    // draw the new data point
    var x = this.canvas.width - this.dataLineWidth,
        y = this.canvas.height,
        step = 0;

    for(var k in values) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.ctx.fillStyle = this.styles[k] || this.styles._default;
        this.ctx.lineWidth = this.dataLineWidth;

        if (k === 'event') {
            if (values[k] === null) continue;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.fillText(values[k], x + this.padding, (this.padding * 2));
        }
        else {
            step = ((values[k] / this.max) * this.canvas.height);
            step = step < 0 ? 0 : step;

            ctx.moveTo(x, y);
            ctx.lineTo(x, y-=step);
        }

        ctx.stroke();
    }
};
