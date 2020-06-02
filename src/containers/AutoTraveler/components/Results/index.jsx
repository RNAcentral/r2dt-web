import React from 'react';
import {connect} from 'react-redux';


class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";

    return (
      <div className="rna">
        {
          this.props.jobId && this.props.status === "does_not_exist" && (
            <div className="row" key={`does-not-exist-div`}>
              <div className="col-sm-9">
                <div className="alert alert-danger">
                  <h4>Job with id='{ this.props.jobId }' does not exist.</h4>
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && this.props.status === "error" && (
            <div className="row" key={`error-div`}>
              <div className="col-sm-9">
                <div className="alert alert-danger">
                  <h4>There was an error.</h4>
                  <a href="mailto:rnacentral@gmail.com">Contact us</a> if the problem persists.
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && this.props.status === "FINISHED" && [
            <div className="row" key={`results-div`}>
              <img src={`http://wp-np2-20.ebi.ac.uk:8080/Tools/services/rest/auto_traveler/result/${this.props.jobId}/svg`}/>
            </div>
          ]
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobId: state.jobId,
    status: state.status,
    submissionError: state.submissionError,
    sequence: state.sequence,
    jobResult: state.jobResult,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
