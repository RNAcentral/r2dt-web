let server = 'http://wp-np2-20.ebi.ac.uk:8080/Tools/services/rest/auto_traveler';

module.exports = {
  submitJob: () => `${server}/run`,
  jobStatus: (jobId) => `${server}/status/${jobId}`,
  jobResult: (jobId, resultType) => `${server}/result/${jobId}/${resultType}`,
};
