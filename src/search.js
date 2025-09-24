/*
 This file contains functions for handling the search form and also to validate the sequence.
*/

export const validateFasta = (text) => {
    const lines = text.trim().split('\n');
    let sequenceIndex = 0;
    let sequence = '';

    if (lines[0].startsWith('>')) {
        if (lines.length < 2) {
            return {
                valid: false,
                error: 'FASTA format requires a sequence after the header',
            };
        }
        sequenceIndex = 1;
    }

    sequence = lines[sequenceIndex].toUpperCase();

    if (!/^[ACGTUWSMKRYBDHVN]+$/.test(sequence)) {
        return {
            valid: false,
            error: 'Invalid nucleotide sequence. Only ACGTUWSMKRYBDHVN are allowed (case-insensitive)',
        };
    }

    if (sequence.length < 4 || sequence.length > 8000) {
        return {
            valid: false,
            error: 'Please check your sequence, it cannot be shorter than 4 or longer than 8000 nucleotides',
        };
    }

    const dotBracketIndex = sequenceIndex + 1;
    if (lines[dotBracketIndex]) {
        const dotBracket = lines[dotBracketIndex];
        const isDotBracket = /[.()]/;
        if (isDotBracket.test(dotBracket) && dotBracket.length !== sequence.length) {
            return {
                valid: false,
                error: 'The secondary structure in dot-bracket notation must be the same length as the fasta sequence',
            };
        }
    }

    return { valid: true };
};

export const showSpinner = (shadowRoot) => {
    const runBtn = shadowRoot.querySelector('.r2dt-search-btn');
    const clearBtn = shadowRoot.querySelector('.r2dt-clear-btn');
    const searchInput = shadowRoot.querySelector('.r2dt-search-input');
    const advancedLink = shadowRoot.querySelector('.r2dt-advanced-link');

    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `
            <span class="r2dt-spinner" role="status" aria-hidden="true"></span>
            Running...
        `;
    }
    if (clearBtn) { clearBtn.disabled = true; }
    if (searchInput) { searchInput.disabled = true; }
    if (advancedLink) { advancedLink.classList.add('r2dt-hidden'); }
};

export const hideSpinner = (shadowRoot) => {
    const runBtn = shadowRoot.querySelector('.r2dt-search-btn');
    const clearBtn = shadowRoot.querySelector('.r2dt-clear-btn');
    const searchInput = shadowRoot.querySelector('.r2dt-search-input');
    const advancedLink = shadowRoot.querySelector('.r2dt-advanced-link');

    if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = 'Run';
    }
    if (clearBtn) { clearBtn.disabled = false; }
    if (searchInput) { searchInput.disabled = false; }
    if (advancedLink) { advancedLink.classList.remove('r2dt-hidden'); }
};

export const renderError = (shadowRoot, message) => {
    const alertContainer = shadowRoot.querySelector('.r2dt-alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="r2dt-alert r2dt-alert-danger" role="alert">
                ${message}
            </div>
        `;
    }
};

export const clearError = (shadowRoot) => {
    const alertContainer = shadowRoot.querySelector('.r2dt-alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
};

export const r2dtSearch = (examples = []) => `
    <div class="r2dt-search-container">
        <div class="r2dt-search-insertion-point">
            <textarea class="r2dt-search-input" placeholder="Enter RNA/DNA sequence with optional FASTA header. Include secondary structure in dot-bracket notation, if available"></textarea>
            <span class="r2dt-advanced-link">Show advanced</span>
        </div>
        <div class="r2dt-search-footer">
            <div class="r2dt-search-examples">
                ${examples.length ? '<span class="r2dt-text-muted r2dt-mr-2">Examples: </span>' : ''}
                ${examples.map(example => {
                    const displayText = example.descriptionNote
                        ? `${example.descriptionNote} (${example.description})`
                        : example.description;
                    return `<span class="r2dt-example" data-description="${example.description}" data-sequence="${example.sequence}">${displayText}</span>`;
                }).join('')}
            </div>
            <div class="r2dt-button-group">
                <button class="r2dt-search-btn">Run</button>
                <button class="r2dt-clear-btn">Clear</button>
            </div>
        </div>
    </div>
`;