import React, { Component, PropTypes } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './searchBoard.css';

const cx = classNames.bind(styles);

@injectContext
class ResultsBoard extends Component {

  props: {
    className: ?any,
    resultsDetails: ?Object
  };

  static contextTypes = {
    flux: PropTypes.object.isRequired
  }

  _renderResultsBody = (results) => {
    const rowCss = 'searchBoardRow';
    const rowColumn = 'searchBoardColumn';
    return (
      <tr className={ cx(rowCss) }>
        <td className={ cx(rowColumn) }>{ results.match_phrase }</td>
        <td className={ cx(rowColumn) }>{ results.item_code }</td>
        <td className={ cx(rowColumn) }>
          <ul className={ cx('goodsRow') }>
            { results.goods.map(e =>
              <li>
                { e }
              </li>
            ) }
          </ul>
        </td>
        <td>{ results.item_description }</td>
      </tr>
    );
  }

  navigateBack = (e) => {
    e.preventDefault();
    const { flux } = this.context;
    flux.getActions('search').showCriteria();
  }

  _renderTop = (resultsData) => {
    const searchHeaderCSS = 'searchBoardHeader';
    return (
      <table className='table table-responsive table-hover'>
        <thead>
          <tr>
            <th className={ cx(searchHeaderCSS) }>Name</th>
            <th className={ cx(searchHeaderCSS) }>Item Code</th>
            <th className={ cx(searchHeaderCSS) }>Matched Good Code</th>
            <th className={ cx(searchHeaderCSS) }>Item Description</th>
          </tr>
        </thead>
        <tbody>
          { resultsData.map(this._renderResultsBody) }
        </tbody>
      </table>
    );
  };

  render() {
    const searchResult = this.props.resultsDetails;
    console.log('In results render');
    console.log(searchResult);
    return (
      <div>
        <nav className={ cx('backNavComponent') }>
          <div className={ cx('backNavContainer') }>
            <b> Search Results for </b> { searchResult.goods.map(item =>
              <span className={ cx('multiSelectSpan') }>
                <span>
                  { item }{ ' ' }
                </span>
              </span>
            ) }
            <div className='pull-right'>
              <a href='' onClick={ this.navigateBack } className={ cx('btnBack') }>
                Modify Search
              </a>
            </div>
          </div>
        </nav>
        { this._renderTop(searchResult.files) }
      </div>
    );
  }
}

export default ResultsBoard;
