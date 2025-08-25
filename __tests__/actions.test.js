import { onSubmit, fetchStatus, getSvg, getFasta, getTsv, fetchSvgFromUrl } from '../src/actions';
import routes from '../src/routes';

global.fetch = jest.fn();

describe('actions.js', () => {
    beforeEach(() => jest.clearAllMocks() );

    test('onSubmit success', async () => {
        fetch
            .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('job123') }) // submitJob
            .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('FINISHED') }) // jobStatus
            .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('>hdr\nACGU\n(((...)))') }) // fasta
            .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('<svg></svg>') }) // svg
            .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('tsv\ttemplate\tsource') }); // tsv

        const result = await onSubmit('body=data');
        expect(result.jobId).toBe('job123');
        expect(result.svg).toContain('<svg');
        expect(result.tsv).toEqual({ template: 'template', source: 'source' });
    });

    test('fetchStatus returns NOT_FOUND', async () => {
        fetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('NOT_FOUND') });
        const result = await fetchStatus('job123');
        expect(result).toBe('NOT_FOUND');
    });

    test('fetchStatus returns error on bad response', async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 500 });
        await expect(fetchStatus('job123')).rejects.toThrow('Error 500');
    });

    test('getFasta parses correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('>header\nACGU\n(((...)))')
        });
        const res = await getFasta('job123');
        expect(res).toEqual({ fastaHeader: '>header', sequence: 'ACGU', dotBracketNotation: '(((...)))' });
    });

    test('getTsv parses correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('col1\ttemplate\tsource')
        });
        const res = await getTsv('job123');
        expect(res).toEqual({ template: 'template', source: 'source' });
    });

    test('getSvg throws on error response', async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 500 });
        await expect(getSvg('job123')).rejects.toThrow('Error 500');
    });

    test('getSvg returns empty string when text is missing', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('')
        });

        const result = await getSvg('job123');
        expect(result).toBe('');
    });

    test('fetchSvgFromUrl returns NO_SVG for invalid data', async () => {
        fetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('not an svg') });
        const res = await fetchSvgFromUrl('http://example.com');
        expect(res).toBe('NO_SVG');
    });

    test('fetchSvgFromUrl handles network errors', async () => {
        fetch.mockRejectedValueOnce(new Error('network failed'));
        const result = await fetchSvgFromUrl('http://bad.url');
        expect(result).toBe('NO_SVG');
    });
});
