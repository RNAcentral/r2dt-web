import * as actions from "../actions/actionTypes";
import initialState from "../store/initialState";


const rootReducer = function (state = initialState, action) {
  let newState;

  switch (action.type) {
    //
    // submission form
    //
    case actions.SUBMIT_JOB:
      switch (action.status) {
        case 'success':
          return Object.assign({}, state, {
            jobId: action.data,
            status: "RUNNING",
            submissionError: ""
          });
        case 'error':
          return Object.assign({}, state, {status: "error", submissionError: action.response.statusText});
        default:
          return newState;
      }

    case actions.UPDATE_STATUS:
      return Object.assign({}, state, {status: "RUNNING"});

    case actions.EXAMPLE_SEQUENCE:
      return Object.assign({}, state, {
        jobId: null,
        sequence: action.sequence,
        status: "notSubmitted",
      });

    case actions.CLEAR_SEQUENCE:
      return Object.assign({}, state, {
        jobId: null,
        status: "notSubmitted",
        sequence: "",
        submissionError: null,
      });

    case actions.TEXTAREA_CHANGE:
      return Object.assign({}, state, {
        jobId: null,
        status: "notSubmitted",
        sequence: action.sequence,
      });

    case actions.INVALID_SEQUENCE:
      return Object.assign({}, state, {status: "invalidSequence"});

    //
    // status
    //
    case actions.FETCH_STATUS:
      if (action.status === 'error') {
        return Object.assign({}, state, {status: "error"});
      } else if (action.status === 'NOT_FOUND') {
        return Object.assign({}, state, {status: "NOT_FOUND"});
      } else {
        return Object.assign({}, state, {status: action})
      }

    case actions.SET_JOB_ID:
      return Object.assign({}, state, {jobId: action.jobId});

    case actions.SET_STATUS_TIMEOUT:
      return Object.assign({}, state, {statusTimeout: action.statusTimeout});

    //
    // results
    //
    case actions.FETCH_RESULTS:
      return Object.assign({}, state, {status: "FINISHED"});

    case actions.SVG_SIZE:
      return Object.assign({}, state, {width: action.width, height: action.height});

    default:
      return state;
  }
};

export default rootReducer;