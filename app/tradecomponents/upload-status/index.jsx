import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';
import ToolTip from 'react-portal-tooltip';

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

  state = {
    isTooltipActive: false
  };

  showTooltip = () => {
    this.setState({ isTooltipActive: true });
  };

  hideTooltip = () => {
    this.setState({ isTooltipActive: false });
  };

  _renderTop = () => {
    let uploadDetails = this.props.uploadDetails;
    let failureReason = '';
    if (this.props.isError) {
      uploadDetails = {};
      uploadDetails.fileName = this.props.errorDetails.fileName;
      uploadDetails.dateUploaded = this.props.errorDetails.dateUploaded;
      failureReason = this.props.errorDetails.message;
    }
    return (
      <div>
        <table className={ cx('uploadDetailsTable') }>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Date Uploaded</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> { uploadDetails ? uploadDetails[Object.keys(uploadDetails)[0]] : '' } <span id='failedAlert' onMouseEnter={ this.showTooltip } onMouseLeave={ this.hideTooltip } className={ this.props.isError ? [ 'glyphicon glyphicon-alert', cx('uploadFailedIcon') ].join(' ') : cx('hidden') } /> </td>
              <td> { uploadDetails ? uploadDetails[Object.keys(uploadDetails)[1]] : '' } </td>
            </tr>
          </tbody>
        </table>
        <ToolTip active={ this.state.isTooltipActive } position='bottom' arrow='left' parent='#failedAlert'>
          <div className={ cx('failureReason') }>
            <p> { failureReason } </p>
          </div>
        </ToolTip>
      </div>
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
