import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';

@injectContext
class UploadStatusBoard extends Component {

  props: {
    className: ?any,
    uploadDetails: ?Object
  };

  _renderTop = () => {
    const uploadDetails = this.props.uploadDetails;
    console.log(uploadDetails);
    return (
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Uploaded</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> { uploadDetails ? uploadDetails[Object.keys(uploadDetails)[0]] : '' } </td>
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
