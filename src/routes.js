// Base URLs and configurations
const ebiDevOrProd = process.env.BRANCH === 'dev' ? 'wwwdev' : 'www';
const server = `https://${ebiDevOrProd}.ebi.ac.uk/Tools/services/rest/r2dt`;
const rnacentralServer = process.env.BRANCH === 'dev' ? 'test.rnacentral' : 'rnacentral';
const rnaCanvasServer = process.env.BRANCH === 'dev'
    ? 'https://rna2drawer2-dev.uk.r.appspot.com' 
    : 'https://rnacanvas.app';

/**
 * Collection of all API endpoints and external URLs used in the application
 */
const routes = {
    submitJob: () => `${server}/run`,
    jobStatus: (jobId) => `${server}/status/${jobId}`,
    fetchUrs: (urs) => `https://${rnacentralServer}.org/api/v1/rna/${urs}/2d/`,
    
    // Result endpoints
    fetchFasta: (jobId) => `${server}/result/${jobId}/fasta`,
    fetchJson: (jobId) => `${server}/result/${jobId}/json`,
    fetchSvg: (jobId) => `${server}/result/${jobId}/svg`,
    fetchSvgAnnotated: (jobId) => `${server}/result/${jobId}/svg_annotated`,
    fetchThumbnail: (jobId) => `${server}/result/${jobId}/thumbnail`,
    fetchTsv: (jobId) => `${server}/result/${jobId}/tsv`,
    
    // External services
    rnaCanvas: (jobId) => `${rnaCanvasServer}?rna_2d_schema_url=${server}/result/${jobId}/json`,
    canvasCode: (jobId) => `https://code.rnacanvas.app/?schema=${server}/result/${jobId}/json`,
    xRNA: (jobId) => `https://ldwlab.github.io/XRNA-React/?source_url=${server}/result/${jobId}/json`,
};

export default routes;
