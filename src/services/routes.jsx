let server = 'https://wwwdev.ebi.ac.uk/Tools/services/rest/auto_traveler';

module.exports = {
  submitJob: () => `${server}/run`,
  jobStatus: (jobId) => `${server}/status/${jobId}`,
  fetchSvg:  (jobId) => `${server}/result/${jobId}/svg`,
};
