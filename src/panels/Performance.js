// TODO: Not measuring render time!!

var Panel = require('./Panel'),
    Graph = require('../util/Graph');

function Performance(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];

    this.colorPalettes = {
        _default: {
            render   : '#7cb5ec',
            state    : '#434348',
            stage    : '#90ed7d',
            tweens   : '#f7a35c',
            sound    : '#8085e9',
            input    : '#f15c80',
            physics  : '#e4d354',
            particles: '#8085e8',
            plugins  : '#8d4653',
            event    : '#91e8e1'
        },
        grid: {
            render   : '#058DC7',
            state    : '#50B432',
            stage    : '#ED561B',
            tweens   : '#DDDF00',
            sound    : '#24CBE5',
            input    : '#64E572',
            physics  : '#FF9655',
            particles: '#FFF263',
            plugins  : '#6AF9C4',
            event    : '#7798BF'
        },
        unica: {
            render   : '#2b908f',
            state    : '#90ee7e',
            stage    : '#f45b5b',
            tweens   : '#7798BF',
            sound    : '#aaeeee',
            input    : '#ff0066',
            physics  : '#eeaaee',
            particles: '#55BF3B',
            plugins  : '#DF5353',
            event    : '#7798BF',
        }
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
    this.graph.addData({
        state    : this.parent.timings.state,
        stage    : this.parent.timings.stage,
        tweens   : this.parent.timings.tweens,
        sound    : this.parent.timings.sound,
        input    : this.parent.timings.input,
        physics  : this.parent.timings.physics,
        particles: this.parent.timings.particles,
        plugins  : this.parent.timings.plugins,
        event    : this.eventQueue.shift()
    });
};

Performance.prototype.mark = function (label) {
    this.eventQueue.push(name);
};
