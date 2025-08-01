/*
 This file contains the buttons displayed at the top of the widget
*/

import { saveSvgAsPng } from 'save-svg-as-png';


// Export function to create a toggle colours button
export function createToggleColoursButton(getSvgElement) {
    const btn = document.createElement('button');
    btn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary');
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
    btn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary');
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
    const btn = document.createElement('button');
    btn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary');
    btn.textContent = 'Copy dot-bracket notation';
    btn.title = 'Copy dot-bracket notation';

    // Wait for DOM to render, then fix width
    requestAnimationFrame(() => {
        btn.style.minWidth = btn.offsetWidth + 'px';
    });

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(dotBracketNotation);

            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    });

    return btn;
}

// Export function to create an edit dropdown button
export function createEditDropdown(editingOptions) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('r2dt-dropdown');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary', 'r2dt-dropdown-toggle');
    toggleBtn.textContent = 'Edit image';
    toggleBtn.title = 'Edit secondary structure';

    const menu = document.createElement('div');
    menu.classList.add('r2dt-dropdown-menu');

    // Show editing options
    editingOptions.forEach(({ label, url }) => {
        const item = document.createElement('button');
        item.classList.add('r2dt-dropdown-item');
        item.textContent = label;
        item.addEventListener('click', () => {
            window.open(url, '_blank', 'noopener,noreferrer');
        });
        menu.appendChild(item);
    });

    dropdown.appendChild(toggleBtn);
    dropdown.appendChild(menu);

    // Toggle menu visibility
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('r2dt-show');
    };

    // Close dropdown if clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('r2dt-show');
        }
    });

    return dropdown;
}

// Export function to create a download dropdown button
export function createDownloadDropdown(getSvgElement, fileName, extraDownloads) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('r2dt-dropdown');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary', 'r2dt-dropdown-toggle');
    toggleBtn.textContent = 'Download';
    toggleBtn.title = 'Download secondary structure';

    const menu = document.createElement('div');
    menu.classList.add('r2dt-dropdown-menu');

    // Download as SVG
    const svgItem = document.createElement('button');
    svgItem.classList.add('r2dt-dropdown-item');
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
    menu.appendChild(svgItem);

    // Download as PNG
    const pngItem = document.createElement('button');
    pngItem.classList.add('r2dt-dropdown-item');
    pngItem.textContent = 'PNG';
    pngItem.onclick = () => {
        const svg = getSvgElement();
        if (!svg) return;
        saveSvgAsPng(svg, `${fileName}.png`, {backgroundColor: 'white', scale: 3});
    };
    menu.appendChild(pngItem);

    // Extra download items (JSON, annotated SVG, thumbnail)
    extraDownloads.forEach(({ label, url, filename }) => {
        const item = document.createElement('button');
        item.classList.add('r2dt-dropdown-item');
        item.textContent = label;
        item.addEventListener('click', () => {
            downloadFile(url, filename);
        });
        menu.appendChild(item);
    });

    dropdown.appendChild(toggleBtn);
    dropdown.appendChild(menu);

    // Toggle menu visibility
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('r2dt-show');
    };

    // Close dropdown if clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('r2dt-show');
        }
    });

    return dropdown;
}

// Export function to create a panel with all buttons
export function createButtonPanel(getSvgElement, fileName, dotBracketNotation, extraDownloads, editingOptions) {
    const panelWrapper = document.createElement('div');
    panelWrapper.classList.add('r2dt-panel-wrapper');

    // Hamburger button
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary', 'r2dt-menu-toggle');
    toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
    toggleBtn.title = 'Menu';

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('r2dt-button-panel');

    // Append buttons
    btnGroup.appendChild(createToggleColoursButton(getSvgElement));
    btnGroup.appendChild(createToggleNumbersButton(getSvgElement));
    btnGroup.appendChild(createCopyDotBracketNotationButton(getSvgElement, dotBracketNotation));
    if (editingOptions.length) btnGroup.appendChild(createEditDropdown(editingOptions));
    btnGroup.appendChild(createDownloadDropdown(getSvgElement, fileName, extraDownloads));

    toggleBtn.addEventListener('click', () => {
        btnGroup.classList.toggle('r2dt-show-buttons');
    });

    panelWrapper.appendChild(toggleBtn);
    panelWrapper.appendChild(btnGroup);
    return panelWrapper;
}

// Helper function to download a file
function downloadFile(url, filename) {
    fetch(url, { mode: 'cors' })
    .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
        return response.blob();
    })
    .then(blob => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    })
    .catch(error => {
        console.error(`Error downloading ${filename}:`, error);
    });
}
