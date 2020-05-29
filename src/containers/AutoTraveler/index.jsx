import React from 'react';

import Results from 'containers/AutoTraveler/components/Results/index.jsx';
import SearchForm from 'containers/AutoTraveler/components/SearchForm/index.jsx';
import {connect} from "react-redux";


class SequenceSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return [
      <SearchForm key={`searchForm`} customStyle={this.props.customStyle} examples={this.props.examples}/>,
      <Results key={`results`} customStyle={this.props.customStyle}/>
    ]
  }
}

function mapStateToProps(state) {
  return {
    jobId: state.jobId,
    status: state.status,
    submissionError: state.submissionError
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SequenceSearch);

