import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash';
import UploadStatusBoard from 'tradecomponents/upload-status/';

class UploadPage extends Component {
  constructor() {
    super();
    this.state = {
      fileData: null,
      uploadStatus: null,
      isUploadTriggered: false
    };

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  static contextTypes = {
    flux: PropTypes.object.isRequired
  }

  handleSubmit = () => {
    const { flux } = this.context;
    const fd = {
      fileData: this.state.fileData,
      filename: this.state.filename,
      filetype: this.state.filetype
    };
    flux.getActions('upload').uploadFile(fd, (response) => {
      this.setState({
        uploadStatus: response,
        isUploadTriggered: true
      });
    });
  }

  handleFile(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        fileData: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
    };

    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <div className='container'>
        <div className='uploadContainerHeader'>
          <h3>Upload Sheets</h3>
        </div>
        <div className='uploadContainer'>
          <h4>Upload File</h4>
          <form className='uploader' encType='multipart/form-data' >
            <input type='file' name='file' id='file' className='upload-file1' onChange={ this.handleFile } />
            <input type='text' name='file-text' id='file-text' className='upload-file-text' onChange={ this.handleFile } />
            <label htmlFor='file' className='upload-label'>Browse</label>
            <input type='button' value='Upload' onClick={ this.handleSubmit } />
          </form>
        </div>
        <div className={ this.state.isUploadTriggered ? 'uploadStatusBoardShow' : 'uploadStatusBoardHide' }>
          <h4>File(s) Uploaded</h4>
          <hr />
          <UploadStatusBoard uploadDetails={ this.state.uploadStatus } />
        </div>
      </div>
    );
  }
}

export default UploadPage;
