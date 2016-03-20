type TChildNode = (Node|Node[]);

function createElement(name: string, props?: TTable<any>, ...children: TChildNode[]) {
    let elm = document.createElement(name);

    for (let p in props) {
        (<any>elm)[p] = props[p];
    }

    appendChildren(elm, children);

    return elm;
};

function appendChildren(elm: HTMLElement, children: TChildNode[]) {
    for (let i = 0; i < children.length; ++i) {
        if (!children[i]) { continue; }

        if (Array.isArray(children[i])) {
            appendChildren(elm, <Node[]>children[i]);
        }
        else {
            elm.appendChild(<Node>children[i]);
        }
    }
}

function text(value: string) {
    return document.createTextNode(value);
}

function empty(elm: Node) {
    while (elm.lastChild) {
        elm.removeChild(elm.lastChild);
    }
}

interface IDOM {
    (name: 'a',         props?: TTable<any>, ...children: TChildNode[]): HTMLAnchorElement;
    (name: 'br',        props?: TTable<any>, ...children: TChildNode[]): HTMLBRElement;
    (name: 'button',    props?: TTable<any>, ...children: TChildNode[]): HTMLButtonElement;
    (name: 'canvas',    props?: TTable<any>, ...children: TChildNode[]): HTMLCanvasElement;
    (name: 'code',      props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'div',       props?: TTable<any>, ...children: TChildNode[]): HTMLDivElement;
    (name: 'em',        props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'h1',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'h2',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'h3',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'h4',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'h5',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'h6',        props?: TTable<any>, ...children: TChildNode[]): HTMLHeadingElement;
    (name: 'hr',        props?: TTable<any>, ...children: TChildNode[]): HTMLHRElement;
    (name: 'img',       props?: TTable<any>, ...children: TChildNode[]): HTMLImageElement;
    (name: 'input',     props?: TTable<any>, ...children: TChildNode[]): HTMLInputElement;
    (name: 'label',     props?: TTable<any>, ...children: TChildNode[]): HTMLLabelElement;
    (name: 'li',        props?: TTable<any>, ...children: TChildNode[]): HTMLLIElement;
    (name: 'ol',        props?: TTable<any>, ...children: TChildNode[]): HTMLOListElement;
    (name: 'optgroup',  props?: TTable<any>, ...children: TChildNode[]): HTMLOptGroupElement;
    (name: 'option',    props?: TTable<any>, ...children: TChildNode[]): HTMLOptionElement;
    (name: 'p',         props?: TTable<any>, ...children: TChildNode[]): HTMLParagraphElement;
    (name: 'pre',       props?: TTable<any>, ...children: TChildNode[]): HTMLPreElement;
    (name: 'select',    props?: TTable<any>, ...children: TChildNode[]): HTMLSelectElement;
    (name: 'small',     props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'span',      props?: TTable<any>, ...children: TChildNode[]): HTMLSpanElement;
    (name: 'strike',    props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'strong',    props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'sub',       props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'sup',       props?: TTable<any>, ...children: TChildNode[]): HTMLPhraseElement;
    (name: 'table',     props?: TTable<any>, ...children: TChildNode[]): HTMLTableElement;
    (name: 'tbody',     props?: TTable<any>, ...children: TChildNode[]): HTMLTableSectionElement;
    (name: 'td',        props?: TTable<any>, ...children: TChildNode[]): HTMLTableDataCellElement;
    (name: 'textarea',  props?: TTable<any>, ...children: TChildNode[]): HTMLTextAreaElement;
    (name: 'tfoot',     props?: TTable<any>, ...children: TChildNode[]): HTMLTableSectionElement;
    (name: 'th',        props?: TTable<any>, ...children: TChildNode[]): HTMLTableHeaderCellElement;
    (name: 'thead',     props?: TTable<any>, ...children: TChildNode[]): HTMLTableSectionElement;
    (name: 'tr',        props?: TTable<any>, ...children: TChildNode[]): HTMLTableRowElement;
    (name: 'ul',        props?: TTable<any>, ...children: TChildNode[]): HTMLUListElement;
    (name: string,      props?: TTable<any>, ...children: TChildNode[]): HTMLElement;

    text: (value: string) => Text;
    empty: (elm: Node) => void;
    appendChildren: (elm: HTMLElement, children: TChildNode[]) => void;
}

let dom = <IDOM>createElement;
dom.text = text;
dom.empty = empty;
dom.appendChildren = appendChildren;

export default dom;
