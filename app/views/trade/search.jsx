import React, { Component } from 'react';
import SearchCriteria from 'tradecomponents/search/criteria';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      isSearchTriggered: false
    };
  }

  render() {
    return (
      <form className='searcher' name='searchForm'>
        <SearchCriteria />
      </form>
    );
  }
}

export default SearchPage;
