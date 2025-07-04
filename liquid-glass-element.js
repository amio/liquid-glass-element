class LiquidGlassElement extends HTMLElement {
    static get observedAttributes() {
        return ['blur', 'dilate', 'scale'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.filterId = `liquid-filter-${Math.random().toString(36).substr(2, 9)}`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    -webkit-backdrop-filter: url(#${this.filterId});
                    backdrop-filter: url(#${this.filterId});
                }
            </style>
            <svg width="0" height="0">
                <filter id="${this.filterId}">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blurredSource" />
                    <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="dilated" />
                    <feGaussianBlur in="dilated" stdDeviation="10" result="blurredDilated" />
                    <feDisplacementMap in2="blurredDilated" in="blurredSource" scale="50" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>
        `;

        this.feGaussianBlurSource = this.shadowRoot.querySelector(`#${this.filterId} feGaussianBlur[in="SourceGraphic"]`);
        this.feMorphology = this.shadowRoot.querySelector(`#${this.filterId} feMorphology`);
        this.feGaussianBlurDilated = this.shadowRoot.querySelector(`#${this.filterId} feGaussianBlur[in="dilated"]`);
        this.feDisplacementMap = this.shadowRoot.querySelector(`#${this.filterId} feDisplacementMap`);

        this._updateFilterAttributes();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this._updateFilterAttributes();
        }
    }

    _updateFilterAttributes() {
        const blur = parseFloat(this.getAttribute('blur')) || 5;
        const dilate = parseFloat(this.getAttribute('dilate')) || 10;
        const scale = parseFloat(this.getAttribute('scale')) || 50;

        if (this.feGaussianBlurSource) this.feGaussianBlurSource.setAttribute('stdDeviation', blur);
        if (this.feMorphology) this.feMorphology.setAttribute('radius', dilate);
        if (this.feGaussianBlurDilated) this.feGaussianBlurDilated.setAttribute('stdDeviation', dilate);
        if (this.feDisplacementMap) this.feDisplacementMap.setAttribute('scale', scale);
    }
}

customElements.define('liquid-glass-element', LiquidGlassElement);
