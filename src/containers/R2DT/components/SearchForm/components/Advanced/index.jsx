import React from 'react';
import {connect} from 'react-redux';
import { ClearButton, Typeahead } from 'react-bootstrap-typeahead';
import * as actionCreators from 'actions/actions';
import { templates } from 'data/index.js';


class Advanced extends React.Component {
  render() {
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    return (
      <div className="card">
        <div className="card-body">
          <p className="card-title" style={{fontSize: fixCss}}><strong>Advanced options</strong></p>
          <p className="card-text" style={{fontSize: fixCss}}>Enter a sequence, select a template and click Run</p>
          <div className="row mb-2">
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="radio1" value="option1" checked={ this.props.searchMethod === 'option1' } onChange={ (e) => this.props.handleOptionChange(e) }/>
                <label className="form-check-label" htmlFor="radio1">Browse all templates</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="radio2" value="option2" checked={ this.props.searchMethod === 'option2' } onChange={ (e) => this.props.handleOptionChange(e) }/>
                <label className="form-check-label" htmlFor="radio2">Type to find a template</label>
              </div>
            </div>
          </div>
          {
            this.props.searchMethod === "option1" ?
                <select style={{fontSize: fixCss}} className="form-control" value={this.props.templateId} onChange={(e) => this.props.onChangeTemplateId(e)}>
                  <option key="default" value="">Select a template</option>
                  {templates.map((item) => (
                    <option key={item.model_id} value={item.model_id}>
                      {item.label}
                    </option>
                  ))}
                </select> :
                <Typeahead
                  className='search-template'
                  id='search-template-id'
                  options={templates}
                  placeholder="Type to find a template"
                  minLength={2}
                  paginate={false}
                  onChange={(e) => this.props.onChangeTemplateId(e)}
                  inputProps={{style: { fontSize: fixCss } }}
                  emptyLabel={'No templates found'} >
                  {({ onClear, selected }) => (
                    <div className="rbt-aux">
                      {!!selected.length && <ClearButton onClick={onClear} />}
                    </div>
                  )}
                </Typeahead>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  templateId: state.templateId,
  searchMethod: state.searchMethod,
});

const mapDispatchToProps = (dispatch) => ({
  handleOptionChange: (event) => dispatch(actionCreators.handleOptionChange(event)),
  onChangeTemplateId: (event) => dispatch(actionCreators.onChangeTemplateId(event)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Advanced);
