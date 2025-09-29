import { showMessage, hideMessage, removeJobIdFromUrl, updateUrl } from '../src/utils';

describe('Utils', () => {
    describe('showMessage', () => {
        test('should display a message in the shadow root', () => {
            const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
            showMessage(shadowRoot, 'Test message');

            const message = shadowRoot.querySelector('.r2dt-message');
            expect(message).not.toBeNull();
            expect(message.textContent).toBe('Test message');
        });
    });

    describe('hideMessage', () => {
        test('should remove message from shadow root', () => {
            const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });

            // First show a message
            showMessage(shadowRoot, 'Test message');
            expect(shadowRoot.querySelector('.r2dt-message')).not.toBeNull();

            // Then hide it
            hideMessage(shadowRoot);
            expect(shadowRoot.querySelector('.r2dt-message')).toBeNull();
        });
    });

    describe('removeJobIdFromUrl', () => {
        beforeEach(() => {
            // Mock window.location
            delete window.location;
            window.location = new URL('http://example.com/?jobid=123');

            // Mock history API
            window.history.pushState = jest.fn();
        });

        test('should remove jobid from URL', () => {
            removeJobIdFromUrl();
            expect(window.history.pushState).toHaveBeenCalledWith(
                {},
                '',
                'http://example.com/'
            );
        });
    });

    describe('updateUrl', () => {
        beforeEach(() => {
            jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
            window.history.pushState.mockClear();
        });

        test('should update URL with job ID', () => {
            updateUrl('job123');
            expect(window.history.pushState).toHaveBeenCalledWith(
                { jobid: 'job123' },
                '',
                'http://example.com/?jobid=job123'
            );
        });
    });
});
