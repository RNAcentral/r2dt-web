import React from 'react';

import Results from 'containers/R2DT/components/Results/index.jsx';
import SearchForm from 'containers/R2DT/components/SearchForm/index.jsx';


class SequenceSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return [
      <SearchForm
          key ={`searchForm`}
          customStyle={this.props.customStyle}
          examples={this.props.examples}
          search={this.props.search}
      />,
      <Results
          key={`results`}
          customStyle={this.props.customStyle}
      />
    ]
  }
}

export default SequenceSearch

