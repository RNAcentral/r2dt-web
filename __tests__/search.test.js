import {
  validateFasta,
  showSpinner,
  hideSpinner,
  renderError,
  clearError,
  r2dtSearch
} from '../src/search';

describe('validateFasta', () => {
    test('should validate correct FASTA format', () => {
        const fasta = '>sequence\nACGUACGUACGU';
        const result = validateFasta(fasta);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    test('should accept the sequence without header', () => {
        const sequence = 'ACGUACGUACGU';
        const result = validateFasta(sequence);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    test('should accept valid dot-bracket structure', () => {
        const fasta = '>seq\nACGU\n.().';
        const result = validateFasta(fasta);
        expect(result.valid).toBe(true);
    });

    test('should reject empty sequence', () => {
        const fasta = '>empty\n';
        const result = validateFasta(fasta);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('FASTA format requires a sequence after the header');
    });

    test('should reject invalid characters in sequence', () => {
        const fasta = '>invalid\nACGT1';
        const result = validateFasta(fasta);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid nucleotide sequence');
    });

    test('should reject invalid dot-bracket notation size', () => {
        const fasta = '>invalid\nACGT\n.().()';
        const result = validateFasta(fasta);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('The secondary structure in dot-bracket notation must be the same length as the fasta sequence');
    });
});

describe('showSpinner & hideSpinner', () => {
    let shadowRoot;
    let runBtn, clearBtn, searchInput, advancedLink;

    beforeEach(() => {
        const div = document.createElement('div');
        shadowRoot = div.attachShadow({ mode: 'open' });

        runBtn = document.createElement('button');
        runBtn.className = 'r2dt-search-btn';
        shadowRoot.appendChild(runBtn);

        clearBtn = document.createElement('button');
        clearBtn.className = 'r2dt-clear-btn';
        shadowRoot.appendChild(clearBtn);

        searchInput = document.createElement('textarea');
        searchInput.className = 'r2dt-search-input';
        shadowRoot.appendChild(searchInput);

        advancedLink = document.createElement('span');
        advancedLink.className = 'r2dt-advanced-link';
        shadowRoot.appendChild(advancedLink);
    });

    test('showSpinner should disable controls and show spinner text', () => {
        showSpinner(shadowRoot);

        expect(runBtn.disabled).toBe(true);
        expect(runBtn.innerHTML).toContain('r2dt-spinner');
        expect(clearBtn.disabled).toBe(true);
        expect(searchInput.disabled).toBe(true);
        expect(advancedLink.classList.contains('r2dt-hidden')).toBe(true);
    });

    test('hideSpinner should restore controls and reset text', () => {
        showSpinner(shadowRoot);  // first apply showSpinner
        hideSpinner(shadowRoot);

        expect(runBtn.disabled).toBe(false);
        expect(runBtn.textContent).toBe('Run');
        expect(clearBtn.disabled).toBe(false);
        expect(searchInput.disabled).toBe(false);
        expect(advancedLink.classList.contains('r2dt-hidden')).toBe(false);
    });
});

describe('renderError & clearError', () => {
    let shadowRoot, alertContainer;

    beforeEach(() => {
        const div = document.createElement('div');
        shadowRoot = div.attachShadow({ mode: 'open' });
        alertContainer = document.createElement('div');
        alertContainer.className = 'r2dt-alert-container';
        shadowRoot.appendChild(alertContainer);
    });

    test('renderError should show error message inside alert container', () => {
        renderError(shadowRoot, 'Test error');
        expect(alertContainer.innerHTML).toContain('Test error');
        expect(alertContainer.querySelector('.r2dt-alert-danger')).not.toBeNull();
    });

    test('clearError should clear alert container contents', () => {
        renderError(shadowRoot, 'Test error');
        clearError(shadowRoot);
        expect(alertContainer.innerHTML).toBe('');
    });
});

describe('r2dtSearch', () => {
    test('should render search container with no examples', () => {
        const html = r2dtSearch();
        expect(html).toContain('r2dt-search-container');
        expect(html).toContain('r2dt-search-input');
        expect(html).toContain('r2dt-search-btn');
    });

    test('should render examples when provided', () => {
        const examples = [
            { description: 'Example 1', sequence: 'ACGU' },
            { description: 'Example 2', sequence: 'UGCA', descriptionNote: 'Note' }
        ];
        const html = r2dtSearch(examples);

        expect(html).toContain('Examples:');
        expect(html).toContain('data-description="Example 1"');
        expect(html).toContain('data-sequence="ACGU"');
        expect(html).toContain('Note (Example 2)');
    });
});