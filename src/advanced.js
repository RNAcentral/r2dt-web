/*
 This file contains functions for handling the advanced search form
*/

import { templates } from './templates.js';

export const setupAdvancedSearch = (shadowRoot, insertionPoint) => {
    const advancedContainer = document.createElement('div');
    advancedContainer.classList.add('r2dt-advanced-container', 'r2dt-hidden');

    advancedContainer.innerHTML = `
        <div class="r2dt-advanced-row">
            <div class="r2dt-card">
                <div class="r2dt-card-header">
                    <strong>Select a template.</strong> <a class="r2dt-link" href="https://rnacentral.org/help/secondary-structure#template" target="_blank">Learn more →</a>
                </div>
                <div class="r2dt-card-body">
                    <div class="r2dt-mb-2">
                        <label><input type="radio" name="template-mode" value="browse" checked> Browse all templates</label>
                        <label><input type="radio" name="template-mode" value="type"> Type to find a template</label>
                    </div>

                    <select id="r2dt-template-select" class="r2dt-template-select">
                        <option value="">Select a template</option>
                        ${templates.map(t => `<option value="${t.model_id}">${t.label}</option>`).join('')}
                    </select>

                    <input type="text" id="r2dt-template-autocomplete" class="r2dt-template-autocomplete r2dt-hidden" placeholder="Start typing..." />
                    <div id="r2dt-autocomplete-list" class="r2dt-autocomplete-list r2dt-hidden"></div>
                </div>
            </div>

            <div class="r2dt-card">
                <div class="r2dt-card-header">
                    <strong>Enable constrained folding.</strong> <a class="r2dt-link" href="https://rnacentral.org/help/secondary-structure#constrained_folding" target="_blank">Learn more →</a>
                </div>
                <div class="r2dt-card-body">
                    <div class="r2dt-mb-2">
                        <label><input type="checkbox" id="r2dt-folding-checkbox"> Constrained folding</label>
                    </div>
                    <select id="r2dt-folding-select" class="r2dt-folding-select r2dt-hidden">
                        <option value>Auto</option>
                        <option value="full_molecule">Full molecule</option>
                        <option value="insertions_only">Insertions only</option>
                        <option value="all_constraints_enforced">All constraints enforced</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    // Insert advanced search container
    if (insertionPoint) {
        insertionPoint.insertAdjacentElement('afterend', advancedContainer);
    } else {
        shadowRoot.appendChild(advancedContainer);
    }

    const autocompleteInput = shadowRoot.querySelector('#r2dt-template-autocomplete');
    const autocompleteList = shadowRoot.querySelector('#r2dt-autocomplete-list');

    // Autocomplete list on input
    autocompleteInput.addEventListener('input', () => {
        const value = autocompleteInput.value.toLowerCase().trim();
        autocompleteList.innerHTML = '';

        if (!value || value.length < 2) {
            autocompleteList.classList.add('r2dt-hidden');
            return;
        }

        const matches = templates.filter(t => t.label.toLowerCase().includes(value)).slice(0, 200);
        if (!matches.length) {
            autocompleteList.classList.add('r2dt-hidden');
            return;
        }

        matches.forEach(t => {
            const item = document.createElement('div');
            item.className = 'r2dt-autocomplete-item';

            // Highlight the matched part
            const regex = new RegExp(`(${value})`, 'i');
            const highlighted = t.label.replace(regex, '<mark>$1</mark>');
            item.innerHTML = highlighted;

            item.addEventListener('click', () => {
                autocompleteInput.value = t.label;
                autocompleteList.classList.add('r2dt-hidden');
            });
            autocompleteList.appendChild(item);
        });

        autocompleteList.classList.remove('r2dt-hidden');
    });

    // Hide list when clicking outside
    document.addEventListener('click', e => {
        if (!shadowRoot.contains(e.target)) {
            autocompleteList.classList.add('r2dt-hidden');
        }
    });

    // Toggle template select vs. autocomplete
    const radios = shadowRoot.querySelectorAll('input[name="template-mode"]');
    const select = shadowRoot.querySelector('#r2dt-template-select');
    const autocomplete = shadowRoot.querySelector('#r2dt-template-autocomplete');

    const toggleTemplateInputs = () => {
        const selected = [...radios].find(r => r.checked)?.value;
        if (selected === 'browse') {
            select.classList.remove('r2dt-hidden');
            autocomplete.classList.add('r2dt-hidden');
        } else {
            select.classList.add('r2dt-hidden');
            autocomplete.classList.remove('r2dt-hidden');
        }
    };

    radios.forEach(radio => {
        radio.addEventListener('change', toggleTemplateInputs);
    });

    toggleTemplateInputs(); // initialize visibility

    // Toggle folding options visibility
    const foldingCheckbox = shadowRoot.querySelector('#r2dt-folding-checkbox');
    const foldingSelect = shadowRoot.querySelector('#r2dt-folding-select');

    const toggleFoldingSelect = () => {
        foldingSelect.classList.toggle('r2dt-hidden', !foldingCheckbox.checked);
    };

    foldingCheckbox.addEventListener('change', toggleFoldingSelect);
    toggleFoldingSelect(); // initialize visibility

    // Show the advanced UI when the link is clicked
    const toggleLink = shadowRoot.querySelector('.r2dt-advanced-link');
    toggleLink?.addEventListener('click', e => {
        e.preventDefault();
        const isHidden = advancedContainer.classList.toggle('r2dt-hidden');
        toggleLink.textContent = isHidden ? 'Show advanced' : 'Hide advanced';
    });
};
