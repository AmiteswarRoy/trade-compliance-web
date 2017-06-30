import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash';
// import UploadFileInput from 'tradecomponents/upload-file/';
import UploadStatusBoard from 'tradecomponents/upload-status/';

import classNames from 'classnames/bind';

import styles from 'tradecomponents/upload-file/upload-file.css';

const cx = classNames.bind(styles);

class UploadPage extends Component {
  constructor() {
    super();
    this.state = {
      fileData: null,
      uploadStatus: null,
      isUploadTriggered: false,
      isValidationError: false,
      isFileSelected: false,
      errorMessage: null,
      uploadErrorMessage: null,
      isUploaderror: false
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
      this.setState({
        filename: '',
        isFileSelected: false
      });
      if (error) {
        this.setState({
          uploadErrorMessage: error,
          isUploaderror: true,
          isUploadTriggered: true
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
    if (file !== undefined) {
      const fileNameArray = file.name.split('.')
      if (fileNameArray[fileNameArray.length - 1].toLowerCase() === 'xlsx' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        reader.onload = (upload) => {
          this.setState({
            fileData: upload.target.result,
            filename: file.name,
            filetype: file.type,
            isFileSelected: true,
            isValidationError: false
          });
        };

        reader.readAsBinaryString(file);
      } else {
        this.setState({
          errorMessage: 'Currently only .xlsx files are supported for upload',
          isValidationError: true,
          filename: file.name,
          isFileSelected: false
        });
      }
    }
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
          <form className='uploader form-horizontal' encType='multipart/form-data' >
            <div className=className={ [ 'form-group', cx('zeroLeftMargin') ].join(' ') }>
              <input type='file' name='file' id='file' className={ cx('inputFile') } onChange={ this.handleFile.bind(this) } />
              <div className={ [ 'col-sm-10 col-md-6 col-lg-6', cx('inputFileButtonLabel') ].join(' ') } >
                <input type='text' name='file-text' id='file-text' className={ [ 'col-sm-12 col-md-12 col-lg-12', cx('inputTextBox') ].join(' ') } placeholder='No file chosen' value={ this.state.filename ? this.state.filename : '' } />
              </div>
              <label htmlFor='file' className={ [ 'col-sm-6 col-md-1 col-lg-1', cx('inputFileButton') ].join(' ') } >
                Browse
              </label>
              <div className='inlineContainer col-sm-6 col-md-3  col-lg-3'>
                <button type='button' disabled={ !this.state.isFileSelected } className='btn btn-primary' onClick={ this.handleSubmit } >
                  { uploadText }
                </button>
              </div>
            </div>
            <div className='validationError'>
              <span className={ this.state.isValidationError ? 'show' : 'hidden' }>
                { this.state.errorMessage }
              </span>
            </div>
          </form>
        </div>
        <div className={ this.state.isUploadTriggered ? 'uploadStatusBoardShow' : 'uploadStatusBoardHide' }>
          <h4>File(s) Uploaded</h4>
          <UploadStatusBoard uploadDetails={ this.state.uploadStatus } isError={ this.state.isUploaderror } errorDetails={ this.state.uploadErrorMessage } />
        </div>
      </div>
    );
  }
}

export default UploadPage;
