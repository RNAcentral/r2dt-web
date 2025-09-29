import { setupAdvancedSearch } from '../src/advanced';
import { templates } from '../src/templates';

// Make a small mock templates array for testing
jest.mock('../src/templates', () => ({
    templates: [
        { model_id: 't1', label: 'Template One' },
        { model_id: 't2', label: 'Template Two' }
    ]
}));

describe('setupAdvancedSearch', () => {
    let container, shadowRoot, insertionPoint;

    beforeEach(() => {
        container = document.createElement('div');
        shadowRoot = container.attachShadow({ mode: 'open' });

        // Add a fake link that setupAdvancedSearch expects
        const advLink = document.createElement('span');
        advLink.className = 'r2dt-advanced-link';
        advLink.textContent = 'Show advanced';
        shadowRoot.appendChild(advLink);

        // Add insertion point
        insertionPoint = document.createElement('div');
        insertionPoint.className = 'r2dt-search-insertion-point';
        shadowRoot.appendChild(insertionPoint);

        setupAdvancedSearch(shadowRoot, insertionPoint);
    });

    test('should insert advanced container after insertion point', () => {
        const advContainer = shadowRoot.querySelector('.r2dt-advanced-container');
        expect(advContainer).not.toBeNull();
        expect(advContainer.classList.contains('r2dt-hidden')).toBe(true);
    });

    test('should toggle between select and autocomplete when radio changes', () => {
        const browseRadio = shadowRoot.querySelector('input[value="browse"]');
        const typeRadio = shadowRoot.querySelector('input[value="type"]');
        const select = shadowRoot.querySelector('#r2dt-template-select');
        const autocomplete = shadowRoot.querySelector('#r2dt-template-autocomplete');

        // Initially browse should be visible
        expect(select.classList.contains('r2dt-hidden')).toBe(false);
        expect(autocomplete.classList.contains('r2dt-hidden')).toBe(true);

        // Switch to type radio
        typeRadio.checked = true;
        typeRadio.dispatchEvent(new Event('change'));

        expect(select.classList.contains('r2dt-hidden')).toBe(true);
        expect(autocomplete.classList.contains('r2dt-hidden')).toBe(false);

        // Switch back to browse
        browseRadio.checked = true;
        browseRadio.dispatchEvent(new Event('change'));

        expect(select.classList.contains('r2dt-hidden')).toBe(false);
        expect(autocomplete.classList.contains('r2dt-hidden')).toBe(true);
    });

    test('should toggle folding select when checkbox is clicked', () => {
        const checkbox = shadowRoot.querySelector('#r2dt-folding-checkbox');
        const foldingSelect = shadowRoot.querySelector('#r2dt-folding-select');

        expect(foldingSelect.classList.contains('r2dt-hidden')).toBe(true);

        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));

        expect(foldingSelect.classList.contains('r2dt-hidden')).toBe(false);

        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));

        expect(foldingSelect.classList.contains('r2dt-hidden')).toBe(true);
    });

    test('should show autocomplete suggestions when typing', () => {
        const input = shadowRoot.querySelector('#r2dt-template-autocomplete');
        const list = shadowRoot.querySelector('#r2dt-autocomplete-list');

        input.value = 'Template';
        input.dispatchEvent(new Event('input'));

        expect(list.classList.contains('r2dt-hidden')).toBe(false);
        expect(list.querySelectorAll('.r2dt-autocomplete-item').length).toBeGreaterThan(0);
    });

    test('should hide autocomplete list when clicking outside', () => {
        const input = shadowRoot.querySelector('#r2dt-template-autocomplete');
        const list = shadowRoot.querySelector('#r2dt-autocomplete-list');

        input.value = 'Template';
        input.dispatchEvent(new Event('input'));
        expect(list.classList.contains('r2dt-hidden')).toBe(false);

        // Create an outside element and click it
        const outside = document.createElement('div');
        document.body.appendChild(outside);
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(list.classList.contains('r2dt-hidden')).toBe(true);
    });


    test('should toggle advanced container when link is clicked', () => {
        const link = shadowRoot.querySelector('.r2dt-advanced-link');
        const advContainer = shadowRoot.querySelector('.r2dt-advanced-container');

        expect(advContainer.classList.contains('r2dt-hidden')).toBe(true);
        expect(link.textContent).toBe('Show advanced');

        link.dispatchEvent(new Event('click'));

        expect(advContainer.classList.contains('r2dt-hidden')).toBe(false);
        expect(link.textContent).toBe('Hide advanced');

        link.dispatchEvent(new Event('click'));

        expect(advContainer.classList.contains('r2dt-hidden')).toBe(true);
        expect(link.textContent).toBe('Show advanced');
    });
});
