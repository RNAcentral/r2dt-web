import svgPanZoom from 'svg-pan-zoom';
import { createButtonPanel } from './buttons.js';
import { r2dtLegend } from './legend.js';
import { widgetStyles } from './styles.js';

class R2DTWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiDomain = 'https://rnacentral.org/api/v1/rna';
        this.panZoomInstance = null;
        this.dotBracketNotation = null;
        this.injectStyles();
    }

    connectedCallback() {
        const urs = this.getAttribute('urs');
        if (!urs) {
            this.renderError('URS attribute is required');
            return;
        }
        this.legendPosition = this.getAttribute('legend') || 'bottomLeft';
        this.loadRnaData(urs);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize);
        if (this.panZoomInstance) this.panZoomInstance.destroy();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = widgetStyles;
        this.shadowRoot.appendChild(style);
    }

    async loadRnaData(urs) {
        this.renderLoading();
        try {
            const response = await fetch(`${this.apiDomain}/${urs}/2d`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            const layout = data?.data?.layout;
            if (!layout) throw new Error('Invalid SVG layout');
            this.dotBracketNotation = data?.data?.secondary_structure;
            this.renderSvg(layout);
            await this.initPanZoom();
        } catch (e) {
            console.error(e);
            this.renderError(e.message);
        }
    }

    renderSvg(svgContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (!svg) {
            this.renderError('No SVG found');
            return;
        }

        if (!svg.hasAttribute('viewBox')) {
            const width = svg.getAttribute('width') || '800';
            const height = svg.getAttribute('height') || '600';
            svg.setAttribute('viewBox', `0 0 ${parseFloat(width)} ${parseFloat(height)}`);
        }

        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Clear previous content
        this.shadowRoot.innerHTML = '';
        this.injectStyles();

        const container = document.createElement('div');
        container.classList.add('viewer-container');

        const svgWrapper = document.createElement('div');
        svgWrapper.classList.add('svg-container');

        svgWrapper.appendChild(svg);
        container.appendChild(svgWrapper);

        // Zoom
        const controls = document.createElement('div');
        controls.classList.add('zoom-controls');

        const zoomInBtn = document.createElement('button');
        zoomInBtn.textContent = '+';
        zoomInBtn.title = 'Zoom In';

        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.textContent = '−';
        zoomOutBtn.title = 'Zoom Out';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '⟳';
        resetBtn.title = 'Reset View';

        controls.appendChild(zoomInBtn);
        controls.appendChild(resetBtn);
        controls.appendChild(zoomOutBtn);
        container.appendChild(controls);

        // Buttons
        const buttonPanel = createButtonPanel(
            () => this.shadowRoot.querySelector('svg'),
            this.getAttribute('urs') || 'secondary-structure',
            this.dotBracketNotation || ''
        );
        container.appendChild(buttonPanel);

        // Legend
        const legendContainer = document.createElement('div');
        legendContainer.classList.add('legend-container');
        legendContainer.classList.add(`legend-${this.legendPosition}`);
        legendContainer.innerHTML = r2dtLegend;
        
        if (this.legendPosition.startsWith('top')) {
            container.insertBefore(legendContainer, container.firstChild);
        } else {
            container.appendChild(legendContainer);
        }

        // Dot-bracket notation
        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add('outer-scroll-wrapper');
        outerWrapper.appendChild(container);

        if (this.dotBracketNotation) {
            const notationWrapper = document.createElement('div');
            notationWrapper.classList.add('dot-bracket-notation');

            const heading = document.createElement('strong');
            heading.textContent = 'Dot-bracket notation';

            const notation = document.createElement('pre');
            notation.textContent = this.dotBracketNotation;

            notationWrapper.appendChild(heading);
            notationWrapper.appendChild(notation);
            outerWrapper.appendChild(notationWrapper);
        }

        this.shadowRoot.appendChild(outerWrapper);
        this.zoomInBtn = zoomInBtn;
        this.zoomOutBtn = zoomOutBtn;
        this.resetBtn = resetBtn;
    }

    async initPanZoom() {
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

        const svg = this.shadowRoot.querySelector('svg');
        if (!svg) return;

        this.panZoomInstance = svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: true,
            center: true,
            minZoom: 0.25,
            maxZoom: 10
        });

        this.zoomInBtn?.addEventListener('click', () => this.panZoomInstance.zoomIn());
        this.zoomOutBtn?.addEventListener('click', () => this.panZoomInstance.zoomOut());
        this.resetBtn?.addEventListener('click', () => {
            this.panZoomInstance.fit();
            this.panZoomInstance.center();
        });

        this.handleResize = () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.panZoomInstance.resize();
                this.panZoomInstance.fit();
                this.panZoomInstance.center();
            }, 250);
        };

        window.addEventListener('resize', this.handleResize);
    }

    renderLoading() {
        this.shadowRoot.innerHTML = '';
        this.injectStyles();
        const div = document.createElement('div');
        div.className = 'r2dt-message';
        div.textContent = 'Loading secondary structure...';
        this.shadowRoot.appendChild(div);
    }

    renderError(message) {
        this.shadowRoot.innerHTML = '';
        this.injectStyles();
        const div = document.createElement('div');
        div.className = 'r2dt-message';
        div.textContent = `Error: ${message}`;
        this.shadowRoot.appendChild(div);
    }
}

customElements.define('r2dt-web', R2DTWidget);
