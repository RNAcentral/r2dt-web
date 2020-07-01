let server = 'https://wwwdev.ebi.ac.uk/Tools/services/rest/r2dt';

module.exports = {
  submitJob: () => `${server}/run`,
  jobStatus: (jobId) => `${server}/status/${jobId}`,
  fetchSvg:  (jobId) => `${server}/result/${jobId}/svg`,
};
