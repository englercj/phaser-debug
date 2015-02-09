// TODO: Not measuring render time!!

var Panel = require('./Panel'),
    Graph = require('../util/Graph');

function Performance(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];

    this.graph = null;

    this.colorPalettes = {
        _default: [
            // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/grid.js
            '#058DC7', '#50B432', '#ED561B', '#DDDF00',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263',
            '#6AF9C4',
            // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/dark-unica.js
            '#2b908f', '#90ee7e', '#f45b5b', '#7798BF',
            '#aaeeee', '#ff0066', '#eeaaee',
            '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
        ]
    };
}

Performance.prototype = Object.create(Panel.prototype);
Performance.prototype.constructor = Performance;

module.exports = Performance;

Performance.prototype.createPanelElement = function () {
    var elm = Panel.prototype.createPanelElement.call(this);

    this.graph = new Graph(elm, window.innerWidth - 20, 256, this.colorPalettes._default);

    return elm;
};

Performance.prototype.update = function () {
    this.graph.addData(this.parent.timings, this.eventQueue.shift());
};

Performance.prototype.mark = function (label) {
    this.eventQueue.push(label);
};

Performance.prototype.destroy = function () {
    Panel.prototype.destroy.call(this);

    this.graph.destroy();

    this.eventQueue = null;
    this.graph = null;
    this.colorPalettes = null;
};
