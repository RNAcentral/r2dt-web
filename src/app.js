import svgPanZoom from 'svg-pan-zoom';
import * as actions from './actions.js';
import { createButtonPanel } from './buttons.js';
import { r2dtLegend } from './legend.js';
import { r2dtDotBracket } from './dotBracket.js';
import routes from './routes';
import {
    clearError,
    hideSpinner,
    r2dtSearch,
    renderError,
    showSpinner,
    validateFasta
} from './search.js';
import { widgetStyles } from './styles.js';
import { setupAdvancedSearch } from './advanced.js';
import { templates } from './templates.js';

class R2DTWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.dotBracketNotation = null;
        this.jobId = null;
        this.source = null;
        this.template = null;
        this.panZoomInstance = null;
        this.urs = null;
    }

    connectedCallback() {
        // Add styles
        const style = document.createElement('style');
        style.textContent = widgetStyles;
        this.shadowRoot.appendChild(style);

        // Get attributes
        this.legendPosition = this.getAttribute('legend') || 'bottomLeft';
        const urs = this.getAttribute('urs');

        if (urs) {
            this.urs = urs;
            this.submitUrs(urs);
        } else {
            // If no URS is provided, show the search field
            const container = document.createElement('div');

            // Get examples from the examples attribute
            let examples = [];
            try {
                const examplesAttr = this.getAttribute('examples');
                if (examplesAttr) {
                    examples = JSON.parse(examplesAttr);
                }
            } catch (e) {
                console.error('Error parsing examples:', e);
            }

            container.innerHTML = r2dtSearch(examples);
            this.shadowRoot.appendChild(container);
            const insertionPoint = container.querySelector('.r2dt-search-insertion-point');
            setupAdvancedSearch(this.shadowRoot, insertionPoint);

            const alertContainer = document.createElement('div');
            alertContainer.className = 'r2dt-alert-container';
            container.appendChild(alertContainer);

            // Submit example sequence
            container.querySelectorAll('.r2dt-example').forEach(example => {
                example.addEventListener('click', async () => {
                    const fastaHeader = example.getAttribute('data-description');
                    const sequence = example.getAttribute('data-sequence');
                    const textarea = this.shadowRoot.querySelector('.r2dt-search-input');

                    if (fastaHeader && sequence && textarea) {
                        const fullSequence = '>' + fastaHeader + '\n' + sequence;
                        textarea.value = fullSequence;
                        await this.submitSequence(fullSequence);
                    }
                });
            });

            const runBtn = this.shadowRoot.querySelector('.r2dt-search-btn');
            const clearBtn = this.shadowRoot.querySelector('.r2dt-clear-btn');
            const textarea = this.shadowRoot.querySelector('.r2dt-search-input');

            const toggleButtons = () => {
                const hasText = textarea?.value.trim().length > 0;
                if (runBtn) runBtn.disabled = !hasText;
                if (clearBtn) clearBtn.disabled = !hasText;
            };

            if (textarea) {
                textarea.addEventListener('input', toggleButtons);
                clearError(this.shadowRoot);
                toggleButtons();
            }

            // Submit text field sequence or R2DT job ID
            if (runBtn) {
                runBtn.addEventListener('click', async () => {
                    const textInput = textarea.value.trim();
                    if (!/^r2dt/.test(textInput) && !/^http/.test(textInput)) {
                        const result = validateFasta(textInput);
                        if (!result.valid) {
                            renderError(this.shadowRoot, result.error);
                            return;
                        }
                    }
                    await this.submitSequence(textInput);
                });
            }

            // Clear text field and advanced search options
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    textarea.value = '';
                    clearError(this.shadowRoot);
                    toggleButtons();
                    const currentSvg = this.shadowRoot.querySelector('.r2dt-outer-scroll-wrapper');
                    if (currentSvg) currentSvg.remove();

                    const templateSelect = this.shadowRoot.querySelector('#r2dt-template-select');
                    const templateAutocomplete = this.shadowRoot.querySelector('#r2dt-template-autocomplete');
                    const foldingCheckbox = this.shadowRoot.querySelector('#r2dt-folding-checkbox');
                    const foldingSelect = this.shadowRoot.querySelector('#r2dt-folding-select');
                    const advancedContainer = this.shadowRoot.querySelector('.r2dt-advanced-container');
                    const advancedLink = this.shadowRoot.querySelector('.r2dt-advanced-link');

                    if (templateSelect) templateSelect.value = '';
                    if (templateAutocomplete) templateAutocomplete.value = '';
                    if (foldingCheckbox) {
                        foldingCheckbox.checked = false;
                        foldingSelect.classList.add('r2dt-hidden');
                    }
                    if (foldingSelect) foldingSelect.value = '';
                    if (advancedContainer) {
                        advancedContainer.classList.add('r2dt-hidden');
                        advancedLink.textContent = 'Show advanced';
                    }
                    window.removeEventListener('resize', this.handleResize);
                });
            }
        }
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize);
        if (this.panZoomInstance) this.panZoomInstance.destroy();
    }

    async submitSequence(sequence) {
        try {
            clearError(this.shadowRoot);
            const oldViewer = this.shadowRoot.querySelector('.r2dt-outer-scroll-wrapper');
            if (oldViewer) oldViewer.remove();
            showSpinner(this.shadowRoot);

            let ebiResponse;
            if (/^http/.test(sequence)) {
                // Fetch SVG from URL
                ebiResponse = await actions.fetchSvgFromUrl(sequence);
            } else if (/^r2dt/.test(sequence)) {
                // Use R2DT job ID to fetch data
                ebiResponse = await actions.fetchStatus(sequence);
            } else {
                // Submit new sequence. First check if the sequence contains dot-bracket notation
                const checkDotBracket = /[.()]/;
                const sequenceWithDotBracket = checkDotBracket.test(sequence);

                // Then fetch the selected template and folding option in the advanced search
                const selectedTemplateMode = this.shadowRoot.querySelector('input[name="template-mode"]:checked')?.value;
                const constrainedFoldingEnabled = this.shadowRoot.querySelector('#r2dt-folding-checkbox')?.checked || false;
                let template = '';
                let foldingOption = '';

                if (!sequenceWithDotBracket) {
                    if (selectedTemplateMode === 'browse') {
                        template = this.shadowRoot.querySelector('#r2dt-template-select')?.value || '';
                    } else if (selectedTemplateMode === 'type') {
                        const selectedLabel = this.shadowRoot.querySelector('#r2dt-template-autocomplete')?.value.trim() || '';
                        const match = templates.find(item => item.label === selectedLabel);
                        template = match?.model_id || '';
                    }

                    if (constrainedFoldingEnabled) {
                        foldingOption = this.shadowRoot.querySelector('#r2dt-folding-select')?.value || '';
                    }
                }

                // Create the body to submit via post request
                let body = `email=rnacentral%40gmail.com&sequence=${sequence}&template_id=${template}`;

                if (!sequenceWithDotBracket && constrainedFoldingEnabled && foldingOption.length > 0) {
                    body += `&constraint=${constrainedFoldingEnabled}&fold_type=${foldingOption}`;
                } else if (!sequenceWithDotBracket && constrainedFoldingEnabled) {
                    body += `&constraint=${constrainedFoldingEnabled}`;
                }

                // Submit new sequence
                ebiResponse = await actions.onSubmit(body);
            }

            if (/^r2dt/.test(sequence) && ebiResponse.sequence) {
                // Replace job ID with fasta header + sequence
                const textarea = this.shadowRoot.querySelector('.r2dt-search-input');
                textarea.value = ebiResponse.fastaHeader + '\n' + ebiResponse.sequence;
            }

            if (ebiResponse === 'NOT_FOUND') {
                renderError(this.shadowRoot, 'Job not found. The results might have expired.');
                return;
            } else if (ebiResponse === 'ERROR' || ebiResponse === 'FAILURE') {
                renderError(this.shadowRoot, 'There was an error with the submission.');
                return;
            } else if (ebiResponse === 'NO_SVG') {
                renderError(this.shadowRoot, 'The provided URL does not return an SVG.');
                return;
            }

            this.dotBracketNotation = ebiResponse.dotBracketNotation;
            this.jobId = ebiResponse.jobId;
            this.source = ebiResponse.tsv.source;
            this.template = ebiResponse.tsv.template;
            this.renderSvg(ebiResponse.svg);
            await this.initPanZoom();
        } catch (error) {
            renderError(this.shadowRoot, error.message);
        } finally {
            hideSpinner(this.shadowRoot);
        }
    }

    async submitUrs(urs) {
        try {
            // Add loading message
            const div = document.createElement('div');
            div.className = 'r2dt-message';
            div.textContent = 'Loading secondary structure...';
            this.shadowRoot.appendChild(div);

            // Fetch secondary structure
            const response = await fetch(routes.fetchUrs(this.urs));
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            const layout = data?.data?.layout;
            if (!layout) throw new Error('Invalid SVG layout');
            this.dotBracketNotation = data?.data?.secondary_structure;

            // Render SVG
            this.renderSvg(layout);
            await this.initPanZoom();
        } catch (error) {
            console.error(error);
            renderError(this.shadowRoot, error.message);
        } finally {
            // Remove loading message
            const message = this.shadowRoot.querySelector('.r2dt-message');
            if (message) message.remove();
        }
    }

    sourceLink(source) {
        const sourceLowerCase = source?.toLowerCase?.();
        if (sourceLowerCase === 'crw') {
            return `<a href="https://crw2-comparative-rna-web.org/" target="_blank">CRW</a>`;
        } else if (sourceLowerCase === 'rfam') {
            return `<a href="https://rfam.org/" target="_blank">Rfam</a>`;
        } else if (sourceLowerCase === 'ribovision') {
            return `<a href="http://apollo.chemistry.gatech.edu/RiboVision/" target="_blank">RiboVision</a>`;
        } else if (sourceLowerCase === 'gtrnadb') {
            return `<a href="http://gtrnadb.ucsc.edu/" target="_blank">GtRNAdb</a>`;
        }
        return source || '';
    }

    renderSvg(svgContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (!svg) {
            renderError(this.shadowRoot, 'No SVG found');
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
        const previousSvg = this.shadowRoot.querySelector('.r2dt-outer-scroll-wrapper');
        if (previousSvg) previousSvg.remove();

        const container = document.createElement('div');
        container.classList.add('r2dt-viewer-container');

        // Button panel
        const buttonPanel = createButtonPanel(
            () => this.shadowRoot.querySelector('.r2dt-svg-container > svg'),
            this.urs || this.jobId,
            this.dotBracketNotation || '',
            this.jobId ? [
                {
                    label: 'JSON',
                    url: routes.fetchJson(this.jobId),
                    filename: `${this.jobId}.json`
                },
                {
                    label: 'SVG annotated',
                    url: routes.fetchSvgAnnotated(this.jobId),
                    filename: `${this.jobId}_annotated.svg`
                },
                {
                    label: 'Thumbnail',
                    url: routes.fetchThumbnail(this.jobId),
                    filename: `${this.jobId}_thumbnail.svg`
                }
            ] : [],
            this.jobId ? [
                {
                    label: 'Edit in RNAcanvas',
                    url: routes.rnaCanvas(this.jobId),
                },
                {
                    label: 'Edit in XRNA-React',
                    url: routes.xRNA(this.jobId),
                },
                {
                    label: 'Edit in RNAcanvas Code',
                    url: routes.canvasCode(this.jobId),
                }
            ] : []
        );
        container.appendChild(buttonPanel);

        // Zoom controls
        const controls = document.createElement('div');
        controls.classList.add('r2dt-zoom-controls');

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

        const svgWrapper = document.createElement('div');
        svgWrapper.classList.add('r2dt-svg-container');
        svgWrapper.appendChild(svg);
        container.appendChild(svgWrapper);

        // Legend
        const legendContainer = document.createElement('div');
        legendContainer.classList.add('r2dt-legend-container');
        legendContainer.classList.add(`r2dt-legend-${this.legendPosition}`);
        legendContainer.innerHTML = r2dtLegend(this.template, this.source);

        if (this.legendPosition.startsWith('top')) {
            container.insertBefore(legendContainer, container.firstChild);
        } else {
            container.appendChild(legendContainer);
        }

        // Add toggle functionality to the legend
        const legendToggleBtn = legendContainer.querySelector('.r2dt-legend-toggle-btn');
        const legendContent = legendContainer.querySelector('.r2dt-legend-content');
        const arrowIcon = legendContainer.querySelector('.r2dt-arrow-icon');

        if (legendToggleBtn && legendContent && arrowIcon) {
            legendToggleBtn.addEventListener('click', () => {
                const isExpanded = legendToggleBtn.getAttribute('aria-expanded') === 'true';
                legendToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
                legendContent.classList.toggle('r2dt-hidden', isExpanded);
                arrowIcon.classList.toggle('r2dt-rotated', isExpanded);
            });
        }

        // Dot-bracket notation
        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add('r2dt-outer-scroll-wrapper');
        outerWrapper.appendChild(container);

        if (this.dotBracketNotation) {
            const notationWrapper = document.createElement('div');
            notationWrapper.classList.add('r2dt-dot-bracket-notation');
            notationWrapper.innerHTML = r2dtDotBracket(this.dotBracketNotation);
            outerWrapper.appendChild(notationWrapper);
        }

        this.shadowRoot.appendChild(outerWrapper);
        this.zoomInBtn = zoomInBtn;
        this.zoomOutBtn = zoomOutBtn;
        this.resetBtn = resetBtn;
    }

    async initPanZoom() {
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

        const svg = this.shadowRoot.querySelector('.r2dt-svg-container > svg');
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
                try {
                    this.panZoomInstance.fit();
                    this.panZoomInstance.center();
                } catch (error) {
                    console.warn('PanZoom fit/center failed:', error);
                }
            }, 250);
        };

        window.addEventListener('resize', this.handleResize);
    }
}

customElements.define('r2dt-web', R2DTWidget);
