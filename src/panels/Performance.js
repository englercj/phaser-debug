// TODO: Not measuring render time!!

var Panel = require('./Panel'),
    Graph = require('../util/Graph');

function Performance(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];

    this.colorPalettes = {
        // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/grid.js
        _default: [
            '#058DC7', '#50B432', '#ED561B', '#DDDF00',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263',
            '#6AF9C4'
        ],
        // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/dark-unica.js
        unica: [
            "#2b908f", "#90ee7e", "#f45b5b", "#7798BF",
            "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
        ]
    };
}

Performance.prototype = Object.create(Panel.prototype);
Performance.prototype.constructor = Performance;

module.exports = Performance;

Performance.prototype.createPanelElement = function () {
    var div = Panel.prototype.createPanelElement.call(this);

    this.graph = new Graph(div, window.innerWidth - 20, 250 - 5, this.colorPalettes._default);

    this.graph.max = 45;

    return div;
};

Performance.prototype.update = function () {
    this.graph.addData(this.parent.timings);
};

Performance.prototype.mark = function (label) {
    this.eventQueue.push(name);
};
