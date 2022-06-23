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
        <div className="card-header">
          <strong>Advanced options</strong>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="card">
                <div className="card-header">
                  <span style={{fontSize: fixCss}}>Select the template you want to use</span>
                </div>
                <div className="card-body">
                  <div className="row mb-2 form-group">
                    <div className="col-12 col-sm-6">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="radios" id="radio1" value="option1" checked={ this.props.searchMethod === 'option1' } onChange={ (e) => this.props.handleOptionChange(e) }/>
                        <label className="form-check-label" htmlFor="radio1">Browse all templates</label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
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
            </div>
            <div className="col-12 col-sm-6">
              <div className="card">
                <div className="card-header">
                  <span style={{fontSize: fixCss}}>Enable constraint flag to select the constraint folding mode</span>
                </div>
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="constrainedFolding" value={this.props.constrainedFolding} onChange={() => this.props.onChangeConstrainedFolding()} />
                        <label className="form-check-label" htmlFor="constrainedFolding">Constrained folding</label>
                      </div>
                    </div>
                  </div>
                  <select style={{fontSize: fixCss}} className="form-control" value={this.props.foldType} onChange={(e) => this.props.onChangeFoldType(e)} disabled={this.props.constrainedFolding ? "": "disabled"}>
                    <option key="default" value=""></option>
                    <option key="full_molecule" value="full_molecule">full_molecule</option>
                    <option key="insertions_only" value="insertions_only">insertions_only</option>
                    <option key="all_constraints_enforced" value="all_constraints_enforced">all_constraints_enforced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  templateId: state.templateId,
  searchMethod: state.searchMethod,
  constrainedFolding: state.constrainedFolding,
  foldType: state.foldType,
});

const mapDispatchToProps = (dispatch) => ({
  handleOptionChange: (event) => dispatch(actionCreators.handleOptionChange(event)),
  onChangeTemplateId: (event) => dispatch(actionCreators.onChangeTemplateId(event)),
  onChangeConstrainedFolding: () => dispatch(actionCreators.onChangeConstrainedFolding()),
  onChangeFoldType: (event) => dispatch(actionCreators.onChangeFoldType(event)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Advanced);
