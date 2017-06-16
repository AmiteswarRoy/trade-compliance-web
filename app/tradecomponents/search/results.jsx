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
    console.log(resultsData);
    return (
      <table className={ [ 'table table-responsive table-hover', cx('searchTable') ].join(' ') }>
        <thead>
          <tr>
            <th className={ cx(searchHeaderCSS) }>Name</th>
            <th className={ cx(searchHeaderCSS) }>Item Code</th>
            <th className={ cx(searchHeaderCSS) }>Matched Good Code</th>
            <th className={ cx(searchHeaderCSS) }>Item Description</th>
          </tr>
        </thead>
        <tbody>
          { resultsData != null && resultsData.length > 0 ? resultsData.map(this._renderResultsBody) : this._renderEmptyTable() }
        </tbody>
      </table>
    );
  };

  _renderEmptyTable = () => {
    const searchError = 'Info:';
    const message = ' No records found';
    return (
      <tr>
        <td colSpan='4'>
          <div className={ cx('noDataMessage') }>
            <div className='alert alert-info' role='alert'>
              <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
              <span className='sr-only'>{ searchError }</span>
              { message }
            </div>
          </div>
        </td>
      </tr>
    );
  };

  _renderMessage = (message) => {
    const searchErrorCSS = 'Error:';
    return (
      <div className='alert alert-danger' role='alert'>
        <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
        <span className='sr-only'>{ searchErrorCSS }</span>
        { message }
      </div>
    );
  };

  render() {
    const searchResult = this.props.resultsDetails;
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
        <div className={ cx('tableScroll') }>
          { 'message' in searchResult ? (this._renderMessage(searchResult.message)) : (this._renderTop(searchResult.files)) }
        </div>
      </div>
    );
  }
}

export default ResultsBoard;
