import {
  createToggleColoursButton,
  createToggleNumbersButton,
  createCopyDotBracketNotationButton,
  createEditDropdown,
  createDownloadDropdown,
  createButtonPanel,
} from '../src/buttons';

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
        jest.clearAllMocks();
    });

    test('createToggleColoursButton returns a button', () => {
        const btn = createToggleColoursButton(() => svg);
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.textContent.toLowerCase()).toContain('colours'); // lowercase match
    });

    test('createToggleNumbersButton returns a button', () => {
        const btn = createToggleNumbersButton(() => svg);
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.textContent.toLowerCase()).toContain('numbers'); // lowercase match
    });

    test('createCopyDotBracketNotationButton copies text', async () => {
        const btn = createCopyDotBracketNotationButton(() => svg, '(((...)))');
        document.body.appendChild(btn);
        btn.click();
        await Promise.resolve(); // wait for async clipboard
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('(((...)))');
    });

    test('createEditDropdown renders menu items', () => {
        const btn = createEditDropdown([{ name: 'EditX', url: 'http://x' }]);
        document.body.appendChild(btn);
        expect(btn.querySelector('.r2dt-dropdown-menu')).not.toBeNull();
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

    test('createButtonPanel renders container with children', () => {
        const panel = createButtonPanel(() => svg, 'file', '(((...)))', [], []);
        document.body.appendChild(panel);

        // The panel itself should exist
        expect(panel.querySelector('.r2dt-button-panel')).not.toBeNull();

        // Check that at least one button is present
        const buttons = panel.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });
});
