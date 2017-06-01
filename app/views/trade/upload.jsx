import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash';
import UploadStatusBoard from 'tradecomponents/upload-status/';

class UploadPage extends Component {
  constructor() {
    super();
    this.state = {
      data_uri: null,
      uploadStatus: null,
      uploadStatusCss: null
    };

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  static contextTypes = {
    flux: PropTypes.object.isRequired
  }

  handleSubmit = () => {
    const { flux } = this.context;
    const fd = {
      data_uri: this.state.data_uri,
      filename: this.state.filename,
      filetype: this.state.filetype
    };
    flux.getActions('upload').uploadFile(fd, (response) => {
      console.log(response);
      this.setState({
        uploadStatus: response,
        isUploadTriggered: 'uploadStatusBoardShow'
      });
    });
  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    console.log(file.name);

    reader.onload = (upload) => {
      this.setState({
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className='container'>
        <h3>Upload Sheets</h3>
        <b>Upload File</b>
        <br />
        <br />
        <form className='uploader' encType='multipart/form-data' >
          <input type='file' name='file' className='upload-file' onChange={ this.handleFile } />
          <input type='button' value='Upload' onClick={ this.handleSubmit } />
        </form>
        <br />
        <div className={ this.state.isUploadTriggered ? 'uploadStatusBoardShow' : 'uploadStatusBoardHide' }>
          <UploadStatusBoard uploadDetails={ this.state.uploadStatus } />
        </div>
      </div>
    );
  }
}

export default UploadPage;
