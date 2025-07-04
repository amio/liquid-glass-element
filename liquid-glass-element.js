/**
 * A custom web component that creates a 'liquid glass' or 'frosted glass'
 * distortion effect over the content behind it. The effect is highly
 * customizable through HTML attributes that control the underlying SVG filters.
 *
 * @customElement liquid-glass-element
 * @attr {number} [width=200] - The width of the element.
 * @attr {number} [height=200] - The height of the element.
 * @attr {number} [radius=25] - The corner roundness (border-radius).
 * @attr {number} [shadow-opacity=17] - The opacity of the dark/shadow layer.
 * @attr {number} [shadow-blur=5] - The blur radius of the dark/shadow layer.
 * @attr {number} [highlight-opacity=17] - The opacity of the light/highlight layer.
 * @attr {number} [highlight-blur=15] - The blur radius of the light/highlight layer.
 * @attr {number} [glass-opacity=68] - The opacity of the main body of the glass.
 * @attr {number} [glass-blur=15] - The blur radius of the main body.
 * @attr {number} [pre-blur=7] - The pre-displacement blur amount.
 * @attr {number} [post-blur=0] - The post-displacement blur amount.
 * @attr {number} [chromatic-aberration=20] - The amount of chromatic aberration (color fringing).
 */
class LiquidGlassElement extends HTMLElement {
  constructor() {
    super();
        this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        #preview {
          width:200px;
          height:200px;
          backdrop-filter:url(#displacementFilter4)/* brightness(0.95)*/;
          pointer-events: none;
        }
        #effectSvg{
          position:absolute;
          top:-999px;
          left:-999px
        }
      </style>
      <div id="preview"></div>
      <div style="position:absolute;top:-999px;left:-999px">
        <svg id="effectSvg" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="displacementFilter4">
            <feImage xlink:href="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%230001' /%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%23FFF' style='filter:blur(5px)' /%3E%3C/svg%3E" x="0%" y="0%" width="100%" height="100%" result="thing9" id="thing9" />
            <feImage xlink:href="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%23FFF1' style='filter:blur(15px)' /%3E%3C/svg%3E" x="0%" y="0%" width="100%" height="100%" result="thing0" id="thing0" />
            <feImage xlink:href="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%23000' /%3E%3C/svg%3E" x="0%" y="0%" width="100%" height="100%" result="thing1" id="thing1" />
            <feImage xlink:href="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gradient1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%2300F'/%3E%3C/linearGradient%3E%3ClinearGradient id='gradient2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%230F0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='200' height='200' rx='25' fill='%237F7F7F' /%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%23000' /%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='url(%23gradient1)' style='mix-blend-mode: screen' /%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='url(%23gradient2)' style='mix-blend-mode: screen' /%3E%3Crect x='50' y='50' width='100' height='100' rx='25' fill='%237F7F7FBB' style='filter:blur(5px)' /%3E%3C/svg%3E" x="0%" y="0%" width="100%" height="100%" result="thing2" id="thing2" />
            <feGaussianBlur stdDeviation="0.7" id="preblur" in="SourceGraphic" result="preblur" />
            <feDisplacementMap id="dispR" in2="thing2" in="preblur" scale="-148" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="disp1" />
            <feDisplacementMap id="dispG" in2="thing2" in="preblur" scale="-150" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="disp2" />
            <feDisplacementMap id="dispB" in2="thing2" in="preblur" scale="-152" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="disp3" />
            <feBlend in2="disp2" mode="screen"/>
            <feBlend in2="disp1" mode="screen"/>
            <feGaussianBlur stdDeviation="0.0" id="postblur" />
            <feBlend in2="thing0" mode="screen"/>
            <feBlend in2="thing9" mode="multiply"/>
            <feComposite in2="thing1" operator="in"/>
            <feOffset dx="43" dy="43"/>
          </filter>
        </svg>
      </div>
    `;
  }

  connectedCallback() {
    this.updateSettings();
  }

  static get observedAttributes() {
    return ['width', 'height', 'radius', 'shadow-opacity', 'shadow-blur', 'highlight-opacity', 'highlight-blur', 'glass-opacity', 'glass-blur', 'pre-blur', 'post-blur', 'chromatic-aberration'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateSettings();
  }

  updateSettings() {
    const vals = {};
    const attributes = this.attributes;
    for (let i = 0; i < attributes.length; i++) {
      vals[attributes[i].name] = attributes[i].value;
    }

    const w = vals.width || 200;
    const h = vals.height || 200;
    const r = vals.radius || 25;
    const d1 = vals['shadow-opacity'] || 17;
    const d2 = vals['shadow-blur'] || 5;
    const l1 = vals['highlight-opacity'] || 17;
    const l2 = vals['highlight-blur'] || 15;
    const c1 = vals['glass-opacity'] || 68;
    const c2 = vals['glass-blur'] || 15;
    const b1 = vals['pre-blur'] || 7;
    const b2 = vals['post-blur'] || 0;
    const c4 = vals['chromatic-aberration'] || 20;

    const effectSvg = this.shadowRoot.getElementById("effectSvg");
    const thing9 = this.shadowRoot.getElementById("thing9");
    const thing0 = this.shadowRoot.getElementById("thing0");
    const thing1 = this.shadowRoot.getElementById("thing1");
    const thing2 = this.shadowRoot.getElementById("thing2");
    const preblur = this.shadowRoot.getElementById("preblur");
    const postblur = this.shadowRoot.getElementById("postblur");
    const dispR = this.shadowRoot.getElementById("dispR");
    const dispG = this.shadowRoot.getElementById("dispG");
    const dispB = this.shadowRoot.getElementById("dispB");
    const preview = this.shadowRoot.getElementById("preview");

    effectSvg.setAttribute("width", `${w}`);
    effectSvg.setAttribute("height", `${h}`);
    effectSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.style.width = `${w}px`;
    preview.style.height = `${h}px`;

    thing9.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='rgb%280 0 0 %2F${d1/2.55}%25%29' /%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='%23FFF' style='filter:blur(${d2}px)' /%3E%3C/svg%3E`);
    thing0.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='rgb%28255 255 255 %2F${l1/2.55}%25%29' style='filter:blur(${l2}px)' /%3E%3C/svg%3E`);
    thing1.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='%23000' /%3E%3C/svg%3E`);
    thing2.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gradient1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%2300F'/%3E%3C/linearGradient%3E%3ClinearGradient id='gradient2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%230F0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='${w}' height='${h}' rx='${r}' fill='%237F7F7F' /%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='%23000' /%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='url(%23gradient1)' style='mix-blend-mode: screen' /%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='url(%23gradient2)' style='mix-blend-mode: screen' /%3E%3Crect x='${w/4}' y='${h/4}' width='${w/2}' height='${h/2}' rx='${r}' fill='rgb%28127 127 127 %2F${(255-c1)/2.55}%25%29' style='filter:blur(${20-c2}px)' /%3E%3C/svg%3E`);
    preblur.setAttribute("stdDeviation", `${b1/10}`);
    postblur.setAttribute("stdDeviation", `${b2/10}`);
    dispR.setAttribute("scale", `${-150+c4/10}`);
    dispG.setAttribute("scale", `${-150}`);
    dispB.setAttribute("scale", `${-150-c4/10}`);
  }
}

customElements.define('liquid-glass-element', LiquidGlassElement);