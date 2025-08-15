/*
 This file contains the buttons displayed above the secondary structure
*/

import { saveSvgAsPng } from 'save-svg-as-png';


// Export function to create a toggle colours button
export function createToggleColoursButton(getSvgElement) {
    const btn = document.createElement('button');
    btn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary');
    btn.title = 'Toggle nucleotide colour';

    const icon = createIcon('M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z');
    const label = document.createTextNode('Toggle colours');
    btn.appendChild(icon);
    btn.appendChild(label);

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
    btn.title = 'Show/Hide sequence numbers';

    const icon = createIcon('M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm200-120Z');
    const label = document.createTextNode('Toggle numbers');
    btn.appendChild(icon);
    btn.appendChild(label);

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
    btn.title = 'Copy dot-bracket notation';

    const icon = createIcon('M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z');
    const label = document.createElement('span');
    label.textContent = 'Copy dot-bracket notation';
    btn.appendChild(icon);
    btn.appendChild(label);

    // Wait for DOM to render, then fix width
    requestAnimationFrame(() => {
        btn.style.minWidth = btn.offsetWidth + 'px';
    });

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(dotBracketNotation);

            const originalText = label.textContent;
            label.textContent = 'Copied!';
            btn.disabled = true;

            setTimeout(() => {
                label.textContent = originalText;
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
    const iconPath = 'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z';

    const menuItems = editingOptions.map(({ label, url }) => ({
        text: label,
        onClick: () => window.open(url, '_blank', 'noopener,noreferrer')
    }));

    return createDropdown('Edit image', iconPath, menuItems);
}

// Export function to create a download dropdown button
export function createDownloadDropdown(getSvgElement, fileName, extraDownloads) {
    const iconPath = 'M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z';

    const menuItems = [
        {
            text: 'SVG',
            onClick: () => {
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
            }
        },
        {
            text: 'PNG',
            onClick: () => {
                const svg = getSvgElement();
                if (!svg) return;
                saveSvgAsPng(svg, `${fileName}.png`, { backgroundColor: 'white', scale: 3 });
            }
        },
        ...extraDownloads.map(({ label, url, filename }) => ({
            text: label,
            onClick: () => downloadFile(url, filename)
        }))
    ];

    return createDropdown('Download', iconPath, menuItems);
}

// Export function to create a panel with all buttons
export function createButtonPanel(getSvgElement, fileName, dotBracketNotation, extraDownloads, editingOptions) {
    const panelWrapper = document.createElement('div');

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
    if (dotBracketNotation) btnGroup.appendChild(createCopyDotBracketNotationButton(getSvgElement, dotBracketNotation));
    if (editingOptions.length) btnGroup.appendChild(createEditDropdown(editingOptions));
    btnGroup.appendChild(createDownloadDropdown(getSvgElement, fileName, extraDownloads));

    toggleBtn.addEventListener('click', () => {
        btnGroup.classList.toggle('r2dt-show-buttons');
    });

    panelWrapper.appendChild(toggleBtn);
    panelWrapper.appendChild(btnGroup);
    return panelWrapper;
}

// Helper function to create a dropdown
function createDropdown(label, iconPath, menuItems) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('r2dt-dropdown');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('r2dt-btn', 'r2dt-btn-outline-secondary', 'r2dt-dropdown-toggle');
    toggleBtn.title = label;

    const icon = createIcon(iconPath);
    const labelNode = document.createTextNode(label);
    toggleBtn.appendChild(icon);
    toggleBtn.appendChild(labelNode);

    const menu = document.createElement('div');
    menu.classList.add('r2dt-dropdown-menu');

    menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.classList.add('r2dt-dropdown-item');
        btn.textContent = item.text;
        btn.addEventListener('click', item.onClick);
        menu.appendChild(btn);
    });

    dropdown.appendChild(toggleBtn);
    dropdown.appendChild(menu);

    toggleBtn.onclick = e => {
        e.stopPropagation();
        menu.classList.toggle('r2dt-show');
    };

    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('r2dt-show');
        }
    });

    return dropdown;
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

// Helper function to create an SVG icon
function createIcon(pathD) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.classList.add('r2dt-svg-icon');
    svg.setAttribute('viewBox', '0 -960 960 960');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);

    svg.appendChild(path);
    return svg;
}
