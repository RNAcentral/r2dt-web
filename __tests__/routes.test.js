import routes from '../src/routes';

describe('routes.js', () => {
    afterEach(() => {
        delete process.env.BRANCH;
        jest.resetModules();
    });

    test('uses production URLs by default', () => {
        expect(routes.submitJob()).toContain('https://www.ebi.ac.uk');
        expect(routes.fetchFasta('123')).toBe('https://www.ebi.ac.uk/Tools/services/rest/r2dt/result/123/fasta');
        expect(routes.rnaCanvas('123')).toBe('https://rnacanvas.app?rna_2d_schema_url=https://www.ebi.ac.uk/Tools/services/rest/r2dt/result/123/json');
        expect(routes.canvasCode('123')).toBe('https://code.rnacanvas.app/?schema=https://www.ebi.ac.uk/Tools/services/rest/r2dt/result/123/json');
        expect(routes.xRNA('123')).toBe('https://ldwlab.github.io/XRNA-React/?source_url=https://www.ebi.ac.uk/Tools/services/rest/r2dt/result/123/json');
    });

    test('uses dev URLs when BRANCH=dev', () => {
        process.env.BRANCH = 'dev';
        jest.resetModules();
        const devRoutes = require('../src/routes').default;

        expect(devRoutes.submitJob()).toContain('https://wwwdev.ebi.ac.uk');
        expect(devRoutes.fetchFasta('123')).toBe('https://wwwdev.ebi.ac.uk/Tools/services/rest/r2dt/result/123/fasta');
        expect(devRoutes.fetchJson('123')).toBe('https://wwwdev.ebi.ac.uk/Tools/services/rest/r2dt/result/123/json');
        expect(devRoutes.fetchSvgAnnotated('123')).toBe('https://wwwdev.ebi.ac.uk/Tools/services/rest/r2dt/result/123/svg_annotated');
        expect(devRoutes.fetchThumbnail('123')).toBe('https://wwwdev.ebi.ac.uk/Tools/services/rest/r2dt/result/123/thumbnail');
    });
});
