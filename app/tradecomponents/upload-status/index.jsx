import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './upload-status.css';

const cx = classNames.bind(styles);

@injectContext
class UploadStatusBoard extends Component {

  props: {
    className: ?any,
    uploadDetails: ?Object,
    errorDetails: ?Object,
    isError: ?boolean
  };

  _renderTop = () => {
    let uploadDetails = this.props.uploadDetails;
    if (this.props.isError) {
      uploadDetails = {};
      uploadDetails.fileName = this.props.errorDetails.fileName;
      uploadDetails.dateUploaded = this.props.errorDetails.dateUploaded;
    }
    return (
      <table className={ cx('uploadDetailsTable') }>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Uploaded</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> { uploadDetails ? uploadDetails[Object.keys(uploadDetails)[0]] : '' } <span className={ this.props.isError ? [ 'glyphicon glyphicon-alert', cx('uploadFailedIcon') ].join(' ') : cx('hidden') } /> </td>
            <td> { uploadDetails ? uploadDetails[Object.keys(uploadDetails)[1]] : '' } </td>
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

export default UploadStatusBoard;
