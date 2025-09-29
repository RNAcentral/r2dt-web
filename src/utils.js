// Create alert container, if it doesn't exist
export function alertContainer(parent) {
    let container = parent.querySelector('.r2dt-alert-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'r2dt-alert-container';
        parent.appendChild(container);
    }
    return container;
}

// Show temporary message
export function showMessage(shadowRoot, text) {
    const div = document.createElement('div');
    div.className = 'r2dt-message';
    div.textContent = text;
    shadowRoot.appendChild(div);
}

// Hide temporary message
export function hideMessage(shadowRoot) {
    const message = shadowRoot.querySelector('.r2dt-message');
    if (message) message.remove();
}

// Remove job ID from URL
export function removeJobIdFromUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('jobid');
    window.history.pushState({}, '', url.toString());
}

// Add job ID to URL
export function updateUrl(jobId) {
    const url = new URL(window.location);
    url.searchParams.set('jobid', jobId);
    window.history.pushState({ jobid: jobId }, '', url.toString());
}

// Disable advanced options
export function disableAdvanced(shadowRoot, disabled) {
    const radios = shadowRoot.querySelectorAll('input[name="template-mode"]');
    const select = shadowRoot.querySelector('#r2dt-template-select');
    const autocomplete = shadowRoot.querySelector('#r2dt-template-autocomplete');
    const foldingCheckbox = shadowRoot.querySelector('#r2dt-folding-checkbox');
    const foldingSelect = shadowRoot.querySelector('#r2dt-folding-select');

    radios.forEach(r => r.disabled = disabled);
    if (select) select.disabled = disabled;
    if (autocomplete) autocomplete.disabled = disabled;
    if (foldingCheckbox) {
        foldingCheckbox.disabled = disabled;
        if (disabled) {
            foldingCheckbox.checked = false;
            foldingSelect?.classList.add('r2dt-hidden');
        } else {
            foldingSelect?.classList.toggle('r2dt-hidden', !foldingCheckbox.checked);
        }
    }
}
