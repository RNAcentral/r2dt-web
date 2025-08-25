import {
  createToggleColoursButton,
  createToggleNumbersButton,
  createCopyDotBracketNotationButton,
  createEditDropdown,
  createDownloadDropdown,
  createButtonPanel,
} from '../src/buttons';
import { saveSvgAsPng } from 'save-svg-as-png';

// Mock clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(),
    },
});

// Mock saveSvgAsPng (used in download dropdown)
jest.mock('save-svg-as-png', () => ({
    saveSvgAsPng: jest.fn(),
}));

describe('buttons.js', () => {
    let svg;

    beforeEach(() => {
        document.body.innerHTML = '';
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        document.body.appendChild(svg);
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('createToggleColoursButton returns a button', () => {
        const btn = createToggleColoursButton(() => svg);
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.textContent.toLowerCase()).toContain('colours'); // lowercase match
    });

    test('toggleColoursButton switches classes', () => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.classList.add('red');
        svg.appendChild(circle);

        const btn = createToggleColoursButton(() => svg);
        document.body.appendChild(btn);

        // First click should replace red→ex-red
        btn.click();
        expect(circle.classList.contains('ex-red')).toBe(true);

        // Second click should restore
        btn.click();
        expect(circle.classList.contains('red')).toBe(true);
    });

    test('createToggleNumbersButton returns a button', () => {
        const btn = createToggleNumbersButton(() => svg);
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.textContent.toLowerCase()).toContain('numbers'); // lowercase match
    });

    test('toggleNumbersButton toggles visibility attributes', () => {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.classList.add('numbering-label');
        svg.appendChild(label);

        const btn = createToggleNumbersButton(() => svg);
        document.body.appendChild(btn);

        btn.click();
        expect(label.getAttribute('visibility')).toBe('hidden');

        btn.click();
        expect(label.getAttribute('visibility')).toBe('visible');
    });

    test('createCopyDotBracketNotationButton copies text', async () => {
        const btn = createCopyDotBracketNotationButton(() => svg, '(((...)))');
        document.body.appendChild(btn);
        btn.click();
        await Promise.resolve(); // wait for async clipboard
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('(((...)))');
    });

    test('copyDotBracketNotationButton resets after timeout', async () => {
        const btn = createCopyDotBracketNotationButton(() => svg, '...(((...)))...');
        document.body.appendChild(btn);

        btn.click();
        await Promise.resolve(); // flush async clipboard
        expect(navigator.clipboard.writeText).toHaveBeenCalled();

        // Label should change to "Copied!"
        const span = btn.querySelector('span');
        expect(span.textContent).toBe('Copied!');

        // Advance timers so text resets
        jest.runAllTimers();
        expect(span.textContent).toContain('Copy dot-bracket');
    });

    test('createEditDropdown renders menu items', () => {
        const btn = createEditDropdown([{ name: 'EditX', url: 'http://x' }]);
        document.body.appendChild(btn);
        expect(btn.querySelector('.r2dt-dropdown-menu')).not.toBeNull();
    });

    test('editDropdown menu item opens window', () => {
        const spy = jest.spyOn(window, 'open').mockImplementation(() => {});
        const btn = createEditDropdown([{ label: 'X', url: 'http://x' }]);
        document.body.appendChild(btn);

        const menuBtn = btn.querySelector('.r2dt-dropdown-item');
        menuBtn.click();

        expect(spy).toHaveBeenCalledWith('http://x', '_blank', 'noopener,noreferrer');
        spy.mockRestore();
    });

    test('createDownloadDropdown renders menu', () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob(['x'])),
        });
        const btn = createDownloadDropdown(() => svg, 'testfile', []);
        document.body.appendChild(btn);
        expect(btn.querySelector('.r2dt-dropdown-menu')).not.toBeNull();
    });

    test('downloadDropdown saves PNG using saveSvgAsPng', () => {
        const btn = createDownloadDropdown(() => svg, 'filex', []);
        document.body.appendChild(btn);

        const menuBtn = [...btn.querySelectorAll('.r2dt-dropdown-item')].find(el => el.textContent === 'PNG');
        menuBtn.click();

        expect(saveSvgAsPng).toHaveBeenCalled();
    });

    test('downloadDropdown handles extra download item', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob(['abc'])),
        });

        const btn = createDownloadDropdown(() => svg, 'file', [
            { label: 'Extra', url: 'http://file', filename: 'extra.txt' },
        ]);
        document.body.appendChild(btn);

        const menuBtn = [...btn.querySelectorAll('.r2dt-dropdown-item')].find(el => el.textContent === 'Extra');
        await menuBtn.click();

        expect(fetch).toHaveBeenCalledWith('http://file', { mode: 'cors' });
    });

    test('createButtonPanel renders container with children', () => {
        const panel = createButtonPanel(() => svg, 'file', '(((...)))', [], []);
        document.body.appendChild(panel);

        // The panel itself should exist
        expect(panel.querySelector('.r2dt-button-panel')).not.toBeNull();

        // Check that at least one button is present
        const buttons = panel.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    test('buttonPanel hamburger toggles class', () => {
        const panel = createButtonPanel(() => svg, 'file', '(((...)))', [], []);
        document.body.appendChild(panel);

        const toggleBtn = panel.querySelector('.r2dt-menu-toggle');
        const group = panel.querySelector('.r2dt-button-panel');

        expect(group.classList.contains('r2dt-show-buttons')).toBe(false);
        toggleBtn.click();
        expect(group.classList.contains('r2dt-show-buttons')).toBe(true);
    });
});
