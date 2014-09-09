var Panel = require('./Panel'),
    Graph = require('../util/Graph');

function Performance(game, parent) {
    Panel.call(this, game, parent);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];

    this.derp = null;
}

Performance.prototype = Object.create(Panel.prototype);
Performance.prototype.constructor = Performance;

module.exports = Performance;

Performance.prototype.createPanelElement = function () {
    var div = Panel.prototype.createPanelElement.call(this);

    this.graph = new Graph(div, window.innerWidth - 20, 250 - 5, {
        input: 'rgba(80, 220, 80, 1)',
        camera: 'rgba(80, 80, 220, 1)',
        phys: 'rgba(80, 220, 200, 1)',
        user: 'rgba(200, 80, 220, 1)',
        draw: 'rgba(220, 80, 80, 1)',
        debug: 'rgba(220, 220, 80, 1)',
        event: 'rgba(200, 200, 200, 0.6)'
    });

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
