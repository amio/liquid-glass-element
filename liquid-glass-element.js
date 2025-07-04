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
          /* The backdrop-filter applies the SVG filter to the content behind the element */
          backdrop-filter:url(#displacementFilter4)/* brightness(0.95)*/;
          pointer-events: none;
        }
        #effectSvg{
          /* The SVG filter definition is hidden from view */
          position:absolute;
          top:-999px;
          left:-999px
        }
      </style>
      <div id="preview"></div>
      <div style="position:absolute;top:-999px;left:-999px">
        <svg id="effectSvg" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <!--
            The SVG filter works by taking the background content (SourceGraphic),
            distorting it, and then blending it with several generated layers to create
            the final glass effect.
          -->
          <filter id="displacementFilter4">
            <!-- Layer 1: A dark, blurred shape to create a shadow/depth effect -->
            <feImage xlink:href="data:image/svg+xml,..." result="shadowLayer" id="shadowLayer" />
            <!-- Layer 2: A light, blurred shape to create a highlight effect -->
            <feImage xlink:href="data:image/svg+xml,..." result="highlightLayer" id="highlightLayer" />
            <!-- Layer 3: A solid shape used as a mask to clip the final output -->
            <feImage xlink:href="data:image/svg+xml,..." result="clipMaskLayer" id="clipMaskLayer" />
            <!-- Layer 4: A complex gradient used as the displacement map. The color values of this image will shift the pixels of the SourceGraphic. -->
            <feImage xlink:href="data:image/svg+xml,..." result="displacementMapLayer" id="displacementMapLayer" />

            <!-- Step 1: Apply an initial blur to the background content (SourceGraphic) -->
            <feGaussianBlur stdDeviation="0.7" id="preblur" in="SourceGraphic" result="preblur" />

            <!-- Step 2: Create chromatic aberration by displacing R, G, and B channels separately -->
            <!-- Displace the Red channel -->
            <feDisplacementMap id="dispR" in2="displacementMapLayer" in="preblur" scale="-148" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="disp1" />
            <!-- Displace the Green channel -->
            <feDisplacementMap id="dispG" in2="displacementMapLayer" in="preblur" scale="-150" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="disp2" />
            <!-- Displace the Blue channel -->
            <feDisplacementMap id="dispB" in2="displacementMapLayer" in="preblur" scale="-152" xChannelSelector="B" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="disp3" />

            <!-- Step 3: Blend the displaced color channels back together -->
            <feBlend in2="disp2" mode="screen"/>
            <feBlend in2="disp1" mode="screen"/>

            <!-- Step 4: Apply an optional post-distortion blur -->
            <feGaussianBlur stdDeviation="0.0" id="postblur" />

            <!-- Step 5: Blend the highlight and shadow layers -->
            <feBlend in2="highlightLayer" mode="screen"/>
            <feBlend in2="shadowLayer" mode="multiply"/>

            <!-- Step 6: Clip the final result to the mask shape -->
            <feComposite in2="clipMaskLayer" operator="in"/>

            <!-- Step 7: Apply a final offset (optional, for 3D-like effects) -->
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

    // --- Component Properties ---
    // Geometry
    const width = vals.width || 200; // The width of the element
    const height = vals.height || 200; // The height of the element
    const radius = vals.radius || 25; // The corner radius of the glass shape

    // Shadow Layer
    const shadowOpacity = vals['shadow-opacity'] || 17; // Opacity of the dark shadow layer (0-255)
    const shadowBlur = vals['shadow-blur'] || 5;    // Blur radius of the shadow layer

    // Highlight Layer
    const highlightOpacity = vals['highlight-opacity'] || 17; // Opacity of the light highlight layer (0-255)
    const highlightBlur = vals['highlight-blur'] || 15;   // Blur radius of the highlight layer

    // Glass Body
    const glassOpacity = vals['glass-opacity'] || 68; // Opacity of the main glass body (0-255)
    const glassBlur = vals['glass-blur'] || 15;    // Blur radius of the glass body

    // Blur Effects
    const preDistortionBlur = vals['pre-blur'] || 7;   // Blur applied to the background before distortion
    const postDistortionBlur = vals['post-blur'] || 0;  // Blur applied after distortion

    // Distortion Effects
    const chromaticAberration = vals['chromatic-aberration'] || 20; // Amount of color fringing (RGB channel separation)

    // --- SVG Element References ---
    const effectSvg = this.shadowRoot.getElementById("effectSvg");
    const shadowLayer = this.shadowRoot.getElementById("shadowLayer");
    const highlightLayer = this.shadowRoot.getElementById("highlightLayer");
    const clipMaskLayer = this.shadowRoot.getElementById("clipMaskLayer");
    const displacementMapLayer = this.shadowRoot.getElementById("displacementMapLayer");
    const preblur = this.shadowRoot.getElementById("preblur");
    const postblur = this.shadowRoot.getElementById("postblur");
    const dispR = this.shadowRoot.getElementById("dispR");
    const dispG = this.shadowRoot.getElementById("dispG");
    const dispB = this.shadowRoot.getElementById("dispB");
    const preview = this.shadowRoot.getElementById("preview");

    // --- Apply Settings to SVG Filters ---
    // Update dimensions of the SVG and the preview div
    effectSvg.setAttribute("width", `${width}`);
    effectSvg.setAttribute("height", `${height}`);
    effectSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    preview.style.width = `${width}px`;
    preview.style.height = `${height}px`;

    // Update the data URIs for the feImage elements with the new attribute values.
    // These SVGs define the shapes and gradients used in the filter.
    shadowLayer.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='rgb%280 0 0 %2F${shadowOpacity/2.55}%25%29' /%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='%23FFF' style='filter:blur(${shadowBlur}px)' /%3E%3C/svg%3E`);
    highlightLayer.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='rgb%28255 255 255 %2F${highlightOpacity/2.55}%25%29' style='filter:blur(${highlightBlur}px)' /%3E%3C/svg%3E`);
    clipMaskLayer.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='%23000' /%3E%3C/svg%3E`);
    displacementMapLayer.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gradient1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%2300F'/%3E%3C/linearGradient%3E%3ClinearGradient id='gradient2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%230F0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='${width}' height='${height}' rx='${radius}' fill='%237F7F7F' /%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='%23000' /%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='url(%23gradient1)' style='mix-blend-mode: screen' /%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='url(%23gradient2)' style='mix-blend-mode: screen' /%3E%3Crect x='${width/4}' y='${height/4}' width='${width/2}' height='${height/2}' rx='${radius}' fill='rgb%28127 127 127 %2F${(255-glassOpacity)/2.55}%25%29' style='filter:blur(${20-glassBlur}px)' /%3E%3C/svg%3E`);
    
    // Update blur values
    preblur.setAttribute("stdDeviation", `${preDistortionBlur/10}`);
    postblur.setAttribute("stdDeviation", `${postDistortionBlur/10}`);

    // Update displacement scales for chromatic aberration
    dispR.setAttribute("scale", `${-150+chromaticAberration/10}`);
    dispG.setAttribute("scale", `${-150}`);
    dispB.setAttribute("scale", `${-150-chromaticAberration/10}`);
  }
}

customElements.define('liquid-glass-element', LiquidGlassElement);