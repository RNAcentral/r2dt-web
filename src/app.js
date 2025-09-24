import svgPanZoom from 'svg-pan-zoom';
import * as actions from './actions.js';
import { createButtonPanel } from './buttons.js';
import { r2dtLegend } from './legend.js';
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
import { alertContainer, showMessage, hideMessage, removeJobIdFromUrl } from './utils.js';

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
        this.legendPosition = this.getAttribute('legend') || 'left';
        const searchAttr = this.getAttribute('search');
        let urs = null;
        let url = null;

        if (searchAttr) {
            try {
                const searchObj = JSON.parse(searchAttr);
                urs = searchObj.urs || null;
                url = searchObj.url || null;
            } catch (e) {
                console.error("Invalid JSON in `search` attribute:", e);
            }
        }

        // Get query parameters
        const params = new URLSearchParams(window.location.search);
        const jobIdInUrl = params.get('jobid');

        if (urs) {
            this.urs = urs;
            this.submitUrs(urs);
        } else if (url) {
            this.submitUrl(url);
        } else {
            // Show text search field
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
            alertContainer(container);

            // Submit example sequence
            container.querySelectorAll('.r2dt-example').forEach(example => {
                example.addEventListener('click', async () => {
                    removeJobIdFromUrl();
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

            // Disable buttons if text field is empty
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

            if (jobIdInUrl) {
                // Set text field value and submit R2DT job ID
                textarea.value = jobIdInUrl;
                toggleButtons();
                this.submitSequence(jobIdInUrl);
            }

            // Submit sequence, R2DT job ID or URL
            if (runBtn) {
                runBtn.addEventListener('click', async () => {
                    removeJobIdFromUrl();
                    const textInput = textarea.value.trim();
                    if (!/^r2dt/.test(textInput) && !/^http/.test(textInput)) {
                        const result = validateFasta(textInput);
                        if (!result.valid) {
                            // Remove old SVG if any and render error
                            const currentSvg = this.shadowRoot.querySelector('.r2dt-outer-scroll-wrapper');
                            if (currentSvg) currentSvg.remove();
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
                    removeJobIdFromUrl();
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

            // Listen to the popstate event in case the user clicks "back" in the browser
            window.addEventListener('popstate', () => {
                const params = new URLSearchParams(window.location.search);
                const jobIdInUrl = params.get('jobid');

                if (jobIdInUrl) {
                    textarea.value = jobIdInUrl;
                    this.submitSequence(jobIdInUrl);
                } else {
                    if (textarea) textarea.value = '';
                    clearError(this.shadowRoot);
                    const currentSvg = this.shadowRoot.querySelector('.r2dt-outer-scroll-wrapper');
                    if (currentSvg) currentSvg.remove();
                }
            });
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
                // Check if the sequence starts with a fasta header. Add ">description" if not
                const checkFastaHeader = /^>/;
                const fastaHeader = checkFastaHeader.test(sequence);
                if (!fastaHeader) {
                    sequence = '>description\n' + sequence;
                }

                // Check if the sequence contains dot-bracket notation
                const checkDotBracket = /[.()]/;
                const sequenceWithDotBracket = checkDotBracket.test(sequence);

                // Fetch the selected template and folding option in the advanced search
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

            // Update state
            this.dotBracketNotation = ebiResponse.dotBracketNotation;
            this.jobId = ebiResponse.jobId;
            this.source = ebiResponse.tsv.source;
            this.template = ebiResponse.tsv.template;

            if (this.jobId) {
                // Update URL
                const url = new URL(window.location);
                url.searchParams.set('jobid', this.jobId);
                window.history.pushState({ jobid: this.jobId }, '', url);
            }

            // Render SVG
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
            showMessage(this.shadowRoot, 'Loading secondary structure...');

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
            alertContainer(this.shadowRoot);
            renderError(this.shadowRoot, "Secondary structure not found.");
        } finally {
            hideMessage(this.shadowRoot);
        }
    }

    async submitUrl(url) {
        try {
            showMessage(this.shadowRoot, 'Loading secondary structure...');

            // Fetch SVG from URL
            const response = await actions.fetchSvgFromUrl(url);
            if (response === 'NO_SVG') {
                alertContainer(this.shadowRoot);
                renderError(this.shadowRoot, "The provided URL does not return an SVG.");
            } else {
                this.renderSvg(response.svg);
                await this.initPanZoom();
            }
        } catch (error) {
            console.error(error);
            alertContainer(this.shadowRoot);
            renderError(this.shadowRoot, "Secondary structure not found.");
        } finally {
            hideMessage(this.shadowRoot);
        }
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
        const textarea = this.shadowRoot.querySelector('.r2dt-search-input');
        const checkDotBracket = /[.()]/;
        const sequenceWithDotBracket = textarea ? checkDotBracket.test(textarea.value) : false;
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
                ...(!sequenceWithDotBracket ? [{
                    label: 'SVG annotated',
                    url: routes.fetchSvgAnnotated(this.jobId),
                    filename: `${this.jobId}_annotated.svg`
                }] : []),
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

        // Outer wrapper
        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add('r2dt-outer-scroll-wrapper');
        outerWrapper.appendChild(container);

        // Legend
        const legendWrapper = document.createElement('div');
        legendWrapper.classList.add('r2dt-legend');

        if (this.legendPosition === 'right') {
            legendWrapper.classList.add('r2dt-legend-right');
        } else if (this.legendPosition === 'center') {
            legendWrapper.classList.add('r2dt-legend-center');
        } else {
            legendWrapper.classList.add('r2dt-legend-left');
        }

        legendWrapper.innerHTML = r2dtLegend(this.template, this.source);
        outerWrapper.appendChild(legendWrapper);

        this.shadowRoot.appendChild(outerWrapper);
        this.zoomInBtn = zoomInBtn;
        this.zoomOutBtn = zoomOutBtn;
        this.resetBtn = resetBtn;
    }

    async initPanZoom() {
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

        const svg = this.shadowRoot.querySelector('.r2dt-svg-container > svg');
        if (!svg) return;

        if (this.handleResize) window.removeEventListener('resize', this.handleResize);

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
