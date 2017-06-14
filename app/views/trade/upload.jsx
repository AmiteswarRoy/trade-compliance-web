import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash';
import UploadFileInput from 'tradecomponents/upload-file/';
import UploadStatusBoard from 'tradecomponents/upload-status/';

class UploadPage extends Component {
  constructor() {
    super();
    this.state = {
      fileData: null,
      uploadStatus: null,
      isUploadTriggered: false,
      isError: false,
      isFileSelected: false,
      errorMessage: null
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
    flux.getActions('upload').uploadFile(fd, (error, response) => {
      if (error) {
        this.setState({
          errorMessage: error.message,
          isError: true
        });
      } else {
        this.setState({
          uploadStatus: response,
          isUploadTriggered: true,
          isFileSelected: true
        });
      }
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
        filetype: file.type,
        isFileSelected: true
      });
    };

    reader.readAsBinaryString(file);
  }

  render() {
    const uploadText = 'UPLOAD';
    return (
      <div className='container'>
        <div className='uploadContainerHeader'>
          <h3>Upload Trade Compliance Feed Spreadsheet</h3>
        </div>
        <div className='uploadContainer'>
          <h4>Upload File</h4>
          <form className='uploader' encType='multipart/form-data' >
            <UploadFileInput inputPlaceHolder='No file chosen' buttonDisplayText='Browse' className='inlineContainer' getFile={ this.handleFile.bind(this) } selectedFileName={ this.state.filename } />
            <div className='inlineContainer'>
              <button type='button' disabled={ !this.state.isFileSelected } className='btn btn-primary' onClick={ this.handleSubmit } >
                { uploadText }
              </button>
              <span className={ this.state.isError ? 'uploadStatusBoardShow' : 'uploadStatusBoardHide' }>
                { this.state.errorMessage }
              </span>
            </div>
          </form>
        </div>
        <div className={ this.state.isUploadTriggered ? 'uploadStatusBoardShow' : 'uploadStatusBoardHide' }>
          <h4>File(s) Uploaded</h4>
          <UploadStatusBoard uploadDetails={ this.state.uploadStatus } />
        </div>
      </div>
    );
  }
}

export default UploadPage;
