//获取 webpack 处理后的 html，没找到不经由网络的办法。
const html = await (await fetch("/common/web-components/quotation-block/index.tpl.html")).text();
const template = new DOMParser().parseFromString(html, "text/html").getElementById("quotation-block")
//console.log(html);

window.customElements.define(template.id, class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
);