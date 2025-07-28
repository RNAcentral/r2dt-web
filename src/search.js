export const validateFasta = (text) => {
    const lines = text.trim().split('\n');

    if (lines.length < 2) {
        return {
            valid: false,
            error: 'FASTA format requires a header and at least one sequence line.',
        };
    }

    if (!lines[0].startsWith('>')) {
        return {
            valid: false,
            error: 'FASTA header must start with ">".',
        };
    }

    const sequence = lines.slice(1).join('').toUpperCase();
    if (!/^[ACGTUWSMKRYBDHVN]+$/.test(sequence)) {
        return {
            valid: false,
            error: 'Invalid nucleotide sequence. Only ACGTUWSMKRYBDHVN are allowed (case-insensitive).',
        };
    }

    return { valid: true };
};

export const showSpinner = (shadowRoot) => {
    const runBtn = shadowRoot.querySelector('.r2dt-search-btn');
    const clearBtn = shadowRoot.querySelector('.r2dt-clear-btn');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `
            <span class="r2dt-spinner" role="status" aria-hidden="true"></span>
            Running...
        `;
    }
    if (clearBtn) { clearBtn.disabled = true; }
};

export const hideSpinner = (shadowRoot) => {
    const runBtn = shadowRoot.querySelector('.r2dt-search-btn');
    const clearBtn = shadowRoot.querySelector('.r2dt-clear-btn');
    if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = 'Run';
    }
    if (clearBtn) { clearBtn.disabled = false; }
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
        <textarea class="r2dt-search-input" placeholder="Enter RNA/DNA sequence or job ID (FASTA format with optional description). Include secondary structure in dot-bracket notation, if available"></textarea>
        <div class="r2dt-search-footer">
            <div class="r2dt-search-examples">
                ${examples.length ? '<span class="r2dt-text-muted r2dt-mr-2">Examples: </span>' : ''}
                ${examples.map(example =>
                    `<span class="r2dt-example" data-description="${example.description}" data-sequence="${example.sequence}">${example.description}</span>`
                ).join('')}
            </div>
            <div class="r2dt-button-group">
                <button class="r2dt-search-btn">Run</button>
                <button class="r2dt-clear-btn">Clear</button>
            </div>
        </div>
    </div>
`;