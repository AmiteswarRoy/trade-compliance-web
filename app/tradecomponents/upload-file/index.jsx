import React, { Component } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './upload-file.css';

const cx = classNames.bind(styles);

@injectContext
class UploadStatusBoard extends Component {

  props: {
    className: ?any
  };

  _renderTop = () => {
    return (
      
    );
  };

  render() {
    return (
      { this._renderTop() }
    );
  }
}

export default UploadStatusBoard;
