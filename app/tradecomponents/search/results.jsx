import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './search.css';

const cx = classNames.bind(styles);

@injectContext
class ResultsBoard extends Component {

  props: {
    className: ?any,
    resultsDetails: ?Array
  };

  _renderResultsBody = (results) => {
    console.log(results);
    const { goods, matchPhrase, itemCode, itemDescription } = results;
    console.log(goods);
    return (
      <tr>
        <td>{ goods }</td>
        <td>{ matchPhrase }</td>
        <td>{ itemCode }</td>
        <td>{ itemDescription }</td>
      </tr>
    );
  }

  _renderTop = () => {
    const resultsData = this.props.resultsDetails;
    console.log(resultsData);
    return (
      <table className={ cx('uploadDetailsTable') }>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Uploaded</th>
            <th>File Name</th>
            <th>Date Uploaded</th>
          </tr>
        </thead>
        <tbody>
          { resultsData.map(this._renderResultsBody) }
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <div>
        { this._renderTop() }
      </div>
    );
  }
}

export default ResultsBoard;
