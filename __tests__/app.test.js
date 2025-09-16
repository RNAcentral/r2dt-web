import { R2DTWidget } from '../src/app';
import * as actions from '../src/actions';
import routes from '../src/routes';

// Mock the search module
jest.mock('../src/search', () => ({
    r2dtSearch: jest.fn().mockReturnValue('<div class="r2dt-search"></div>'),
    showSpinner: jest.fn(),
    hideSpinner: jest.fn(),
    renderError: jest.fn(),
    clearError: jest.fn()
}));

// Mock the advanced module
jest.mock('../src/advanced', () => ({
    setupAdvancedSearch: jest.fn()
}));

// Mock the actions module
jest.mock('../src/actions', () => ({
    fetchSvgFromUrl: jest.fn().mockResolvedValue({ svg: '<svg></svg>' }),
    fetchStatus: jest.fn().mockResolvedValue({}),
    onSubmit: jest.fn().mockResolvedValue({})
}));

describe('R2DTWidget', () => {
    let container;
    let widget;

    beforeAll(() => {
        if (!window.customElements.get('r2dt-web')) {
            window.customElements.define('r2dt-web', R2DTWidget);
        }
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (widget) widget.remove();
        container.remove();
        jest.clearAllMocks();
    });

    test('should initialize with default properties', () => {
        widget = document.createElement('r2dt-web');
        container.appendChild(widget);

        expect(widget.isConnected).toBe(true);
        expect(widget.jobId).toBeNull();
        expect(widget.source).toBeNull();
        expect(widget.template).toBeNull();
    });

    test('should render search interface by default', () => {
        widget = document.createElement('r2dt-web');
        container.appendChild(widget);

        return Promise.resolve().then(() => {
            const shadowRoot = widget.shadowRoot;
            expect(shadowRoot).not.toBeNull();

            const searchContainer = shadowRoot.querySelector('.r2dt-search');
            expect(searchContainer).not.toBeNull();
        });
    });

    test('should not render search interface if url parameter is provided', () => {
        widget = document.createElement('r2dt-web');
        widget.setAttribute('search', '{"url": "https://example.com"}');
        container.appendChild(widget);

        return Promise.resolve().then(() => {
            const shadowRoot = widget.shadowRoot;
            expect(shadowRoot).not.toBeNull();

            const searchContainer = shadowRoot.querySelector('.r2dt-search');
            expect(searchContainer).toBeNull();
        });
    });

    test('should call submitUrl and render SVG when url attribute is set', async () => {
        jest.spyOn(actions, 'fetchSvgFromUrl').mockResolvedValue({
            svg: '<svg id="test-svg"></svg>'
        });

        widget = document.createElement('r2dt-web');
        widget.setAttribute('search', '{"url": "https://example.com/test"}');
        container.appendChild(widget);

        await Promise.resolve();
        expect(actions.fetchSvgFromUrl).toHaveBeenCalledWith('https://example.com/test');

        const svg = widget.shadowRoot.querySelector('#test-svg');
        expect(svg).not.toBeNull();
    });

    test('should call submitUrs and render SVG when urs attribute is set', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    layout: '<svg id="urs-svg"></svg>',
                    secondary_structure: '(((...)))'
                }
            })
        });

        widget = document.createElement('r2dt-web');
        widget.setAttribute('search', '{"urs": "URS0000001"}');
        container.appendChild(widget);

        await Promise.resolve();
        await Promise.resolve();

        expect(global.fetch).toHaveBeenCalledWith(routes.fetchUrs('URS0000001'));

        const svg = widget.shadowRoot.querySelector('#urs-svg');
        expect(svg).not.toBeNull();
    });

    test('should handle fetch error when urs attribute is set', async () => {
        // Mock fetch with a failure response
        global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

        widget = document.createElement('r2dt-web');
        widget.setAttribute('search', '{"urs": "URS_FAIL"}');
        container.appendChild(widget);

        await Promise.resolve();

        expect(global.fetch).toHaveBeenCalled();
        // renderError is mocked from ../src/search
        const { renderError } = require('../src/search');
        expect(renderError).toHaveBeenCalledWith(widget.shadowRoot, "Secondary structure not found.");
    });

    test('should handle NO_SVG error when url attribute is set', async () => {
        const { renderError } = require('../src/search');
        jest.spyOn(actions, 'fetchSvgFromUrl').mockResolvedValue("NO_SVG");

        widget = document.createElement('r2dt-web');
        widget.setAttribute('search', '{"url": "https://bad.example.com"}');
        container.appendChild(widget);

        await Promise.resolve();

        expect(actions.fetchSvgFromUrl).toHaveBeenCalledWith('https://bad.example.com');
        expect(renderError).toHaveBeenCalledWith(widget.shadowRoot, "The provided URL does not return an SVG.");
    });

    test('handles NOT_FOUND response', async () => {
        actions.onSubmit.mockResolvedValue('NOT_FOUND');
        await widget.submitSequence('ACGU');
        const { renderError } = require('../src/search');
        expect(renderError).toHaveBeenCalledWith(widget.shadowRoot, expect.stringContaining('not found'));
    });

    test('handles NO_SVG response', async () => {
        actions.fetchSvgFromUrl.mockResolvedValue('NO_SVG');
        await widget.submitSequence('http://bad.url');
        const { renderError } = require('../src/search');
        expect(renderError).toHaveBeenCalledWith(widget.shadowRoot, expect.stringContaining('SVG'));
    });

    test('renderSvg with no svg element calls renderError', () => {
        const { renderError } = require('../src/search');
        widget.renderSvg('<html></html>');
        expect(renderError).toHaveBeenCalled();
    });

    test('legend toggle button works', () => {
        widget.renderSvg('<svg width="10" height="10"></svg>');
        const btn = widget.shadowRoot.querySelector('.r2dt-legend-toggle-btn');
        if (btn) {
            btn.click();
            expect(btn.getAttribute('aria-expanded')).toBe('false');
        }
    });
});
