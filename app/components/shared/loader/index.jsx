import React, { Component, PropTypes } from 'react';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import Throbber from './throbber';
import styles from './loader.css';

const cx = classNames.bind(styles);

@injectContext
class Loader extends Component {

  props: {
    style: ?{}
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };

  static defaultProps = {
    size: 1
  };

  render() {
    const { style } = this.props;
    const cxName = cx('component', 'dj-throbber');

    return (
      <div className={ cxName } style={ style }>
        <div className={ cx('inner') }>
          {
            <Throbber lightBackground={ false } />
          }
        </div>
      </div>
    );
  }
}

export default Loader;
