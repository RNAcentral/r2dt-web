let ebiDevOrProd = process.env.REACT_APP_BRANCH === 'dev' ? 'wwwdev' : 'www';
let server =  `https://${ebiDevOrProd}.ebi.ac.uk/Tools/services/rest/r2dt`;

module.exports = {
  submitJob:  () => `${server}/run`,
  jobStatus:  (jobId) => `${server}/status/${jobId}`,
  fetchSvg:   (jobId) => `${server}/result/${jobId}/svg`,
  fetchFasta: (jobId) => `${server}/result/${jobId}/fasta`,
  fetchTsv:   (jobId) => `${server}/result/${jobId}/tsv`,
};
