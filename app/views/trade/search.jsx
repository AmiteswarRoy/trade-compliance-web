import React, { Component } from 'react';
import SearchCriteria from 'tradecomponents/search/criteria';
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
    collection: ?Object,
    isSearchTriggered: ?boolean
  }

  render() {
    const { isSearchTriggered } = this.props;
    return (
      <form className='searcher' name='searchForm'>
        <SearchCriteria />
        <div className={ isSearchTriggered ? 'show' : 'hidden' }>
          Hi
        </div>
      </form>
    );
  }
}

export default SearchPage;
