//Some general dom helpers
var ui = {
    delegate: function(dom, evt, selector, fn) {
        dom.addEventListener(evt, function(e) {
            window.target = e.target;
            if (e.target && e.target.matches(selector)) {
                e.delegateTarget = e.target;
                if (fn) fn(e);
            }
            else if (e.target.parentElement && e.target.parentElement.matches(selector)) {
                e.delegateTarget = e.target.parentElement;
                if (fn) fn(e);
            }
        });
    },

    on: function(dom, evt, delegate, fn) {
        if (typeof delegate === 'function') {
            fn = delegate;
            delegate = null;
        }

        if (delegate) {
            return ui.delegate(dom, evt, delegate, fn);
        }

        dom.addEventListener(evt, fn);
    },

    removeClass: function(dom, cls) {
        var classes = dom.className.split(' '),
            i = classes.indexOf(cls);

        if(i !== -1) {
            classes.splice(i, 1);
            dom.className = classes.join(' ').trim();
        }
    },

    addClass: function(dom, cls) {
        var classes = dom.className.split(' ');

        classes.push(cls);
        dom.className = classes.join(' ').trim();
    },

    hasClass: function(dom, cls) {
        return dom.className.split(' ').indexOf(cls) !== -1;
    },

    toggleClass: function(dom, cls) {
        if (ui.hasClass(dom, cls)) {
            ui.removeClass(dom, cls);
        } else {
            ui.addClass(dom, cls);
        }
    },

    setText: function(dom, txt) {
        dom.textContent = txt;
    },

    setHtml: function(dom, html) {
        dom.innerHTML = html;
    },

    setStyle: function(dom, style, value) {
        if(typeof style === 'string') {
            dom.style[style] = value;
        } else {
            for(var key in style) {
                dom.style[key] = style[key];
            }
        }
    },

    empty: function(dom) {
        while(dom.firstChild) {
            dom.removeChild(dom.firstChild);
        }
    },

    show: function(dom) {
        ui.setStyle(dom, 'display', 'block');
    },

    hide: function(dom) {
        ui.setStyle(dom, 'display', 'none');
    },

    clear: function() {
        var br = document.createElement('br');
        ui.setStyle(br, 'clear', 'both');

        return br;
    },

    addCss: function (css) {
        var style = document.createElement('style');

        style.type = 'text/css';

        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    }
};

module.exports = ui;

// polyfill for matchesSelector
if (!HTMLElement.prototype.matches) {
    var htmlprot = HTMLElement.prototype;

    htmlprot.matches =
        htmlprot.matches ||
        htmlprot.webkitMatchesSelector ||
        htmlprot.mozMatchesSelector ||
        htmlprot.msMatchesSelector ||
        htmlprot.oMatchesSelector ||
        function (selector) {
            // poorman's polyfill for matchesSelector
            var elements = this.parentElement.querySelectorAll(selector),
                element,
                i = 0;

            while (element = elements[i++]) {
                if (element === this) return true;
            }
            return false;
        };
}
