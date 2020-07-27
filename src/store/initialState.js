let initialState = {
  jobId: null,
  status: "notSubmitted",  // options: error, RUNNING, FINISHED, NOT_FOUND and FAILURE
  submissionError: null,
  sequence: "",
  width: 900,
  height: 600,
  svg: null,
  svgColor: true,
  svgNumber: true,
  notation: "",
  template: "",
  source: "",
  searchPerformed: false
};

export default initialState;
