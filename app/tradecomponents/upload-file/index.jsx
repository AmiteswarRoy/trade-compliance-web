import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './upload-file.css';

const cx = classNames.bind(styles);

@injectContext
class UploadFileInput extends Component {

  props: {
    className: ?any,
    inputPlaceHolder: ?String,
    buttonDisplayText: ?String,
    getFile: ?Function,
    selectedFileName: ?String
  };

  static defaultProps = {
    onGetFile: () => ({})
  };

  render() {
    const { inputPlaceHolder, buttonDisplayText, className } = this.props;
    console.log(inputPlaceHolder);
    console.log(buttonDisplayText);
    console.log(buttonDisplayText);

    return (
      <div className={ cx(className) }>
        <input type='file' name='file' id='file' className={ cx('inputFile') } onChange={ this.props.getFile } />
        <span className={ cx('inputFileButtonLabel') } >
          <input type='text' name='file-text' id='file-text' className={ cx('inputTextBox') } placeholder={ inputPlaceHolder } value={ this.props.selectedFileName } />
        </span>
        <label htmlFor='file' className={ cx('inputFileButton') } >
          { buttonDisplayText }
        </label>
      </div>
    );
  }
}

export default UploadFileInput;
