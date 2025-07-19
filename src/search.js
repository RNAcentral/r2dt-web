export const r2dtSearch = (examples = []) => `
<div class="r2dt-search-container">
    <textarea class="r2dt-search-input" placeholder="Enter RNA/DNA sequence or job ID (FASTA format with optional description). Include secondary structure in dot-bracket notation, if available"></textarea>
    <div class="r2dt-search-footer">
        <div class="r2dt-search-examples">
            ${examples.length ? '<span class="r2dt-text-muted r2dt-mr-2">Examples: </span>' : ''}
            ${examples.map(example => 
                `<span class="r2dt-example" data-sequence="${example.sequence.replace(/"/g, '&quot;')}">${example.description}</span>`
            ).join('')}
        </div>
        <div class="r2dt-button-group">
            <button class="r2dt-search-btn">Run</button>
            <button class="r2dt-clear-btn">Clear</button>
        </div>
    </div>
</div>
`;