/*
 This file contains the buttons displayed at the top of the widget
*/

import { saveSvgAsPng } from 'save-svg-as-png';


// Export function to create a toggle colours button
export function createToggleColoursButton(getSvgElement) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-secondary');
    btn.textContent = 'Toggle colours';
    btn.title = 'Toggle nucleotide colour';

    let svgColor = true;
    const colourOn = ['green', 'red', 'blue'];
    const colourOff = ['ex-green', 'ex-red', 'ex-blue'];

    const toggle = (from, to) => {
        const svgElement = getSvgElement();
        if (!svgElement) return;
        svgElement.querySelectorAll(`.${from}`).forEach(el => {
            el.classList.remove(from);
            el.classList.add(to);
        });
    };

    btn.addEventListener('click', () => {
        for (let i = 0; i < colourOn.length; i++) {
            if (svgColor) {
                toggle(colourOn[i], colourOff[i]);
            } else {
                toggle(colourOff[i], colourOn[i]);
            }
        }
        svgColor = !svgColor;
    });

    return btn;
}

// Export function to create a toggle numbers button
export function createToggleNumbersButton(getSvgElement) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-secondary');
    btn.textContent = 'Toggle numbers';
    btn.title = 'Show/Hide sequence numbers';

    let numbersVisible = true;

    const selectors = [
        '.numbering-label',
        '.numbering-line',
        '.numbering-label.sequential',
        '.numbering-line.sequential'
    ];

    btn.addEventListener('click', () => {
        const svg = getSvgElement();
        if (!svg) return;
        selectors.forEach(selector => {
            svg.querySelectorAll(selector).forEach(el => {
                el.setAttribute('visibility', numbersVisible ? 'hidden' : 'visible');
            });
        });
        numbersVisible = !numbersVisible;
    });

    return btn;
}

// Export function to create a copy dot-bracket notation button
export function createCopyDotBracketNotationButton(getSvgElement, dotBracketNotation) {
    const divDotBracket = document.createElement('div');
    divDotBracket.style.position = 'relative';
    divDotBracket.style.display = 'inline-block';

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-secondary');
    btn.textContent = 'Copy dot-bracket notation';
    btn.title = 'Copy dot-bracket notation';

    const message = document.createElement('span');
    message.classList.add('btn-copy-message');
    message.textContent = 'Copied!';
    message.style.display = 'none';

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(dotBracketNotation);
            message.style.display = 'inline';
            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    });

    divDotBracket.appendChild(btn);
    divDotBracket.appendChild(message);

    return divDotBracket;
}

// Export function to create a download dropdown button
export function createDownloadDropdown(getSvgElement, fileName) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn', 'btn-outline-secondary', 'dropdown-toggle');
    toggleBtn.textContent = 'Download';
    toggleBtn.title = 'Download secondary structure';

    const menu = document.createElement('div');
    menu.classList.add('dropdown-menu');

    // Download as SVG
    const svgItem = document.createElement('button');
    svgItem.classList.add('dropdown-item');
    svgItem.textContent = 'SVG';
    svgItem.onclick = () => {
        const svg = getSvgElement();
        if (!svg) return;
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Download as PNG
    const pngItem = document.createElement('button');
    pngItem.classList.add('dropdown-item');
    pngItem.textContent = 'PNG';
    pngItem.onclick = () => {
        const svg = getSvgElement();
        if (!svg) return;
        saveSvgAsPng(svg, `${fileName}.png`, {backgroundColor: 'white', scale: 3});
    };

    menu.appendChild(svgItem);
    menu.appendChild(pngItem);
    dropdown.appendChild(toggleBtn);
    dropdown.appendChild(menu);

    // Toggle menu visibility
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    };

    // Close dropdown if clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('show');
        }
    });

    return dropdown;
}

// Export function to create a panel with all buttons
export function createButtonPanel(getSvgElement, fileName, dotBracketNotation) {
    const panel = document.createElement('div');
    panel.classList.add('btn-group');
    panel.style.position = 'absolute';
    panel.style.left = '50%';
    panel.style.transform = 'translateX(-50%)';
    panel.style.zIndex = '10';

    panel.appendChild(createToggleColoursButton(getSvgElement));
    panel.appendChild(createToggleNumbersButton(getSvgElement));
    panel.appendChild(createCopyDotBracketNotationButton(getSvgElement, dotBracketNotation));
    panel.appendChild(createDownloadDropdown(getSvgElement, fileName));

    return panel;
}
