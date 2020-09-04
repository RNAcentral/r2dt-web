let ebiDevOrProd = process.env.REACT_APP_BRANCH === 'dev' ? 'wwwdev' : 'www';
let server =  `https://${ebiDevOrProd}.ebi.ac.uk/Tools/services/rest/r2dt`;
let firebaseServer = 'https://r2dt-dev.firebaseio.com';

module.exports = {
  submitJob:  () => `${server}/run`,
  jobStatus:  (jobId) => `${server}/status/${jobId}`,
  fetchSvg:   (jobId) => `${server}/result/${jobId}/svg`,
  fetchFasta: (jobId) => `${server}/result/${jobId}/fasta`,
  fetchTsv:   (jobId) => `${server}/result/${jobId}/tsv`,
  firebase:   () => `${firebaseServer}/data.json`,
  firebaseId: (id) => `${firebaseServer}/data/${id}.json`
};
