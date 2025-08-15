/*
 This file contains functions for handling the dot-bracket notation
*/

export function r2dtDotBracket(dotBracketNotation) {
    return `
        <div class="r2dt-card">
            <div class="r2dt-card-header"><strong>Dot-bracket notation</strong></div>
            <div class="r2dt-card-body"><span>${dotBracketNotation}</span></div>
        </div>
    `;
}
