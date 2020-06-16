import * as types from './actionTypes';
import routes from 'services/routes.jsx';
import {store} from 'app.jsx';

//
// submission form
//
export function onSubmit(sequence) {
  return function(dispatch) {
    dispatch({type: types.UPDATE_STATUS});
    fetch(routes.submitJob(), {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=rnacentral%40gmail.com&sequence=${sequence}`
    })
    .then(function (response) {
      if (response.ok) {
        return response.text();
      } else {
        throw response;
      }
    })
    .then(data => {
        dispatch({type: types.SUBMIT_JOB, status: 'success', data: data});
        dispatch(fetchStatus(data));
    })
    .catch(error => dispatch({type: types.SUBMIT_JOB, status: 'error', response: error}));
  }
}

export function onExampleSequence(sequence) {
  return {type: types.EXAMPLE_SEQUENCE, sequence: sequence};
}

export function onClearSequence() {
  return {type: types.CLEAR_SEQUENCE}
}

export function onSequenceTextAreaChange(event) {
  let sequence = event.target.value;
  return {type: types.TEXTAREA_CHANGE, sequence: sequence};
}

export function invalidSequence() {
  return {type: types.INVALID_SEQUENCE}
}

//
// status
//
export function fetchStatus(jobId) {
  let state = store.getState();

  return function(dispatch) {
    if (!state.jobId) {dispatch({type: types.SET_JOB_ID, jobId: jobId})}
    fetch(routes.jobStatus(jobId), {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    })
    .then(function(response) {
      if (response.ok) {
        return response.text()
      } else {
        throw response;
      }
    })
    .then((data) => {
      if (data === 'RUNNING') {
        let statusTimeout = setTimeout(() => store.dispatch(fetchStatus(jobId)), 2000);
        dispatch({type: types.SET_STATUS_TIMEOUT, timeout: statusTimeout});
      } else if (data === 'FINISHED') {
        // Wait another second to change the status. This will allow the SVG resultType to work correctly.
        let statusTimeout = setTimeout(() => dispatch({type: types.FETCH_RESULTS}), 1000);
        dispatch({type: types.SET_STATUS_TIMEOUT, timeout: statusTimeout});
        dispatch(svgSize(jobId));
      } else if (data === 'NOT_FOUND') {
        dispatch({type: types.FETCH_STATUS, status: 'NOT_FOUND'})
      }
    })
    .catch(error => {
      if (store.getState().hasOwnProperty('statusTimeout')) {
        clearTimeout(store.getState().statusTimeout); // clear status timeout
      }
      dispatch({type: types.FETCH_STATUS, status: 'error'})
    });
  }
}

//
// results
//
export function onDownloadSVG(jobId) {
  return function(dispatch) {
    fetch(routes.downloadSvg(jobId), {
      method: 'GET',
      headers: { 'Accept': 'text/plain' },
    })
    .then(function (response) {
      if (response.ok) { return response.blob() }
      else { throw response }
    })
    .then(data => {
      let link = window.document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = jobId + '.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

export function svgSize(jobId) {
  return function(dispatch) {
    fetch(routes.downloadSvg(jobId), {
      method: 'GET',
      headers: { 'Accept': 'text/plain' },
    })
    .then(function (response) {
      if (response.ok) { return response.text() }
      else { throw response }
    })
    .then(data => {
      let width = (data.match(/width="(.*?)"/)[1]);
      let height = (data.match(/height="(.*?)"/)[1]);
      dispatch({type: types.SVG_SIZE, width: width, height: height, svg: data})
    });
  }
}