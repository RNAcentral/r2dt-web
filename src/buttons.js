/*
 This file contains the buttons displayed at the top of the widget
*/

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

// Export function to create a panel with all buttons
export function createButtonPanel(getSvgElement) {
    const panel = document.createElement('div');
    panel.classList.add('btn-group');
    panel.style.position = 'absolute';
    panel.style.top = '10px';
    panel.style.left = '50%';
    panel.style.transform = 'translateX(-50%)';
    panel.style.zIndex = '10';

    panel.appendChild(createToggleColoursButton(getSvgElement));
    panel.appendChild(createToggleNumbersButton(getSvgElement));

    return panel;
}
