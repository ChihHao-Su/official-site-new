// import 'bootstrap';
// import style from "common.scss";
//import * as Common from "/common";

//获取 webpack 处理后的 html。
// Uncaught TypeError: document.body is null
// Uncaught Error: Cannot find module '../../.yarn/__virtual__/css-loader-virtual-8bfbb8a0ac/0/cache/css-loader-npm-7.1.2-7540f12884-15bfd90d77.zip/node_modules/css-loader/dist/runtime/noSourceMaps.js'
//import indexHtmlString from "./index.tpl.html?render"
//const html = indexHtmlString;

// Workaround
const html = await (await fetch("/common/web-components/date-range-selector/index.tpl.html")).text();


const template = new DOMParser().parseFromString(html, "text/html").getElementById("date-range-selector")


// const scriptUrl = template.content.querySelector("script").getAttribute("src");
// const script = await (await fetch(scriptUrl)).text();

// 参考 https://dev.to/stuffbreaker/custom-forms-with-web-components-and-elementinternals-4jaj
// 如何用 Web Component 制作自定义表单控件

window.customElements.define(template.id, class extends HTMLElement {

    static formAssociated = true;
    static get observedAttributes() {
        return ["required", "value", "name"];
    }

    $input;
    _attrs = {};
    _internals;
    _defaultValue = "";

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._internals.role = "textbox";
        this.tabindex = 0;
    }

    connectedCallback() {

        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(template.content);
        this.$input = shadowRoot.querySelector("#date-input");

        this.setProps();
        this._defaultValue = this.$input.value;
        this._internals.setFormValue(this.value);
        this._internals.setValidity(
            this.$input.validity,
            this.$input.validationMessage,
            this.$input
        );
        this.$input.addEventListener("onChange", () => this.handleInput());
        shadowRoot.querySelector(".btn").addEventListener("click", () => {
            this.$input.value = null;
        });

        const flatpickr = window.flatpickr;
        flatpickr.localize(flatpickr.l10ns.zh);
        flatpickr(this.$input, {
            mode: "range",
            
            maxDate: new Date(2022, 7, 1, 0, 0, 0, 0),
            minDate: new Date(2017, 11, 1, 0, 0, 0, 0),
            onChange: this.handleInput.bind(this)
        });

    }

    attributeChangedCallback(name, prev, next) {
        this._attrs[name] = next;
        //debugger;
    }

    formDisabledCallback(disabled) {
        this.$input.disabled = disabled;
    }

    formResetCallback() {
        this.$input.value = this._defaultValue;
    }

    checkValidity() {
        return this._internals.checkValidity();
    }

    reportValidity() {
        return this._internals.reportValidity();
    }

    get validity() {
        return this._internals.validity;
    }

    get validationMessage() {
        return this._internals.validationMessage;
    }

    setProps() {
        //debugger;
        // prevent any errors in case the input isn't set
        if (!this.$input) {
            return;
        }

        // loop over the properties and apply them to the input
        for (let prop in this._attrs) {
            switch (prop) {
                case "value":
                    this.$input.value = this._attrs[prop];
                    break;
                case "required":
                    const required = this._attrs[prop];
                    this.$input.toggleAttribute(
                        "required",
                        required === "true" || required === ""
                    );
                    break;
            }
        }

        // reset the attributes to prevent unwanted changes later
        this._attrs = {};
    }

    handleInput(dates, dateStr) {
        this._internals.setValidity(
            this.$input.validity,
            this.$input.validationMessage,
            this.$input
        );
        // 只選擇了一個日期，則設爲空值
        if(dates.length == 1)
            this._internals.setFormValue(null)
        else
            this._internals.setFormValue(dateStr);
    }
});