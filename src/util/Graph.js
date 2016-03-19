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
