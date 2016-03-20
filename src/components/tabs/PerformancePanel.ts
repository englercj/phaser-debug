import TabPanel from './TabPanel';
import UI from '../UI';

import Graph from '../../util/Graph';

export default class PerformancePanel extends TabPanel {
    graph: Graph;

    colorPalettes: { [key: string]: string[] };

    constructor(ui: UI) {
        super(ui, 'Performance');

        this.colorPalettes = {
            _default: [
                // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/dark-unica.js
                '#2b908f', '#90ee7e', '#f45b5b', '#7798BF',
                '#aaeeee', '#ff0066', '#eeaaee',
                '#55BF3B', '#DF5353', '#7798BF', '#aaeeee',
                // Colors from: https://github.com/highslide-software/highcharts.com/blob/master/js/themes/grid.js
                '#058DC7', '#50B432', '#ED561B', '#DDDF00',
                '#24CBE5', '#64E572', '#FF9655', '#FFF263',
                '#6AF9C4',
            ],
        };

        this.graph = new Graph(window.innerWidth, 260, this.colorPalettes['_default']);
    }

    update() {
        this.graph.addData(this.ui.plugin.timings);
    }

    render() {
        return super.render(this.graph.element);
    }

    destroy() {
        super.destroy();

        this.graph.destroy();

        this.graph = null;
        this.colorPalettes = null;
    }
}
