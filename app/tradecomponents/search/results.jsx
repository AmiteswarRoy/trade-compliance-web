import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './search.css';

const cx = classNames.bind(styles);

@injectContext
class ResultsBoard extends Component {

  props: {
    className: ?any,
    resultsData: ?Object
  };

  _renderTop = () => {
    const resultsData = this.props.resultsData;
    console.log(resultsData);
    return (
      <table className='table table-responsive'>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Uploaded</th>
            <th>File Name</th>
            <th>Date Uploaded</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> { resultsData ? resultsData[Object.keys(resultsData)[0]] : '' } </td>
            <td> { resultsData ? resultsData[Object.keys(resultsData)[1]] : '' } </td>
            <td> { resultsData ? resultsData[Object.keys(resultsData)[2]] : '' } </td>
            <td> { resultsData ? resultsData[Object.keys(resultsData)[3]] : '' } </td>
          </tr>
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
