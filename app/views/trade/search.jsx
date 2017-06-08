import React, { Component } from 'react';
import SearchCriteria from 'tradecomponents/search/criteria';
import ResultsBoard from 'tradecomponents/search/results';
import connect from 'connect-alt';

@connect(({ search: { collection, isSearchTriggered } }) => ({ collection, isSearchTriggered }))
class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      isError: false,
      errorMessage: null
    };
  }

  props: {
    collection: Object,
    isSearchTriggered: boolean
  }

  render() {
    const { isSearchTriggered, collection } = this.props;
    return (
      <form className='searcher' name='searchForm'>
        <div className={ isSearchTriggered ? 'hidden' : 'show' }>
          <SearchCriteria />
        </div>
        <div className={ isSearchTriggered ? 'show' : 'hidden' }>
          <ResultsBoard resultsDetails={ collection } />
        </div>
      </form>
    );
  }
}

export default SearchPage;
