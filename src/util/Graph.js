//TODO: Rewrite this as a single canvas that clears each frame.

function Graph(container, width, height, dataStyles) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    //setup data canvases, these are used to prerender the data graph
    //and having two of them allows me to clear one when the other takes
    //up the entire graph, so I have "wrap" the graph around to get more
    this.dataCanvases = [
        document.createElement('canvas'),
        document.createElement('canvas')
    ];
    this.dataCtxs = [
        this.dataCanvases[0].getContext('2d'),
        this.dataCanvases[1].getContext('2d')
    ];
    this.dataScroll = [
        0,
        0
    ];
    this.dataIndex = 0;

    this.label = 'ms';
    this.labelPrecision = 0;
    this.labelStyle = 'rgba(200, 200, 200, 0.6)';
    this.max = 50;
    this.dataLineWidth = 1;
    this.padding = 5;

    this.keySize = 115;

    this.dataCanvases[0].width = this.dataCanvases[1].width = width - this.keySize;
    this.dataCanvases[0].height = this.dataCanvases[1].height = height;

    this.data = [];
    this.styles = dataStyles || {};

    if(!this.styles._default)
        this.styles._default = 'red';

    if(!this.styles.event)
        this.styles.event = 'gray';
};

Graph.prototype.constructor = Graph;

Graph.prototype.addData = function (values) {
    this.data.push(values);

    if(this.data.length > ((this.canvas.width - this.keySize) / this.dataLineWidth))
        this.data.shift();

    this.render();
};

Graph.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateData();

    this.drawBg();
    this.drawKey();
    this.drawData();
};

Graph.prototype.drawBg = function () {
    var ctx = this.ctx,
        minX = this.keySize,
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

Graph.prototype.drawKey = function () {
    var ctx = this.ctx,
        i = 0,
        box = 10,
        data = this.data[this.data.length - 1],
        pad = this.padding,
        lbl = this.labelStyle;

    for(var k in this.styles) {
        var style = this.styles[k],
            y = (box * i) + (pad * (i+1)),
            val = typeof data[k] === 'number' ? data[k].toFixed(2) : null,
            text = k + (val ? ' (' + val + ' ms)' : '');

        ctx.fillStyle = style;
        ctx.fillRect(pad, y, box, box);
        ctx.fillStyle = lbl;
        ctx.fillText(text, pad + box + pad, y + box);

        i++;
    }
};

Graph.prototype.drawData = function () {
    var i = this.dataIndex,
        ni = this.dataIndex ? 0 : 1,
        c1 = this.dataCanvases[i],
        s1 = this.dataScroll[i],
        c2 = this.dataCanvases[ni],
        s2 = this.dataScroll[ni],
        w = c1.width,
        h = c1.height;

    //draw on prerender of data
    this.ctx.drawImage(
        c1,
        0, //sx
        0, //sy
        s1, //sw
        h, //sh
        w - s1 + this.keySize, //dx
        0, //dy
        s1,
        h
    );
    if(s2 - w >= 0) {
        this.ctx.drawImage(
            c2,
            s2 - w, //sx
            0, //sy
            w - (s2 - w), //sw
            h, //sh
            this.keySize, //dx
            0, //dy
            w - (s2 - w), //dw
            h //dh
        );
    }

    if(w === s1) {
        this.dataScroll[ni] = this.dataLineWidth;
        this.dataCtxs[ni].clearRect(0, 0, w, h);
        this.dataIndex = ni;
    }
};

//draw the latest data point into the dataCanvas
Graph.prototype.updateData = function () {
    var ctx = this.dataCtxs[this.dataIndex],
        x = this.dataScroll[this.dataIndex],
        maxY = this.dataCanvases[this.dataIndex].height,
        lw = this.dataLineWidth,
        vals = this.data[this.data.length - 1],
        v = 0, step = 0, y = maxY;

    for(var k in vals) {
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = this.styles[k] || this.styles._default;
        ctx.lineWidth = lw;

        v = vals[k];
        if(k === 'event') {
            ctx.moveTo(x, maxY);
            ctx.lineTo(x, 0);
            ctx.fillText(v, x+this.padding, (this.padding*2));
        } else {
            step = ((v / this.max) * maxY);
            step = step < 0 ? 0 : step;

            ctx.moveTo(x, y);
            ctx.lineTo(x, y-=step);
        }

        ctx.stroke();
    }
    this.dataScroll[0] += lw;
    this.dataScroll[1] += lw;
};
