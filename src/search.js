export const r2dtSearch = `
<div class="r2dt-search-container">
    <textarea class="r2dt-search-input" placeholder="Enter RNA/DNA sequence or job ID (FASTA format with optional description). Include secondary structure in dot-bracket notation, if available"></textarea>
    <div class="r2dt-search-footer">
        <div class="r2dt-search-examples">
            <span class="r2dt-text-muted r2dt-mr-2">Examples: </span>
            <span class="r2dt-example">3SKZ_B</span>
            <span class="r2dt-example">MT-RNR1</span>
            <span class="r2dt-example">S box leader</span>
            <span class="r2dt-example">RNVU1-1</span>
            <span class="r2dt-example">PDB 3J7Y chain A</span>
            <span class="r2dt-example">TRT-TGT2-1</span>
            <span class="r2dt-example">Rn18s</span>
        </div>
        <div class="r2dt-button-group">
            <button class="r2dt-search-btn">Run</button>
            <button class="r2dt-clear-btn">Clear</button>
        </div>
    </div>
</div>
`;