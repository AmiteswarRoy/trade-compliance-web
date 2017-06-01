import React, { Component } from 'react';
import { Row, observeGrid } from 'react-cellblock';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';

import styles from './header.css';

const cx = classNames.bind(styles);

@observeGrid
@injectContext
class SiteHeader extends Component {

  props: {
    className: ?any
  };

  _renderTop = () => {
    const header = 'RISK CENTER | TRADE COMPILANCE';
    return (
      <Row className={ cx('top', 'clearfix') }>
        <div className={ cx('top-left', 'clearfix') }>
          { header }
        </div>
      </Row>
    );
  };

  render() {
    const { className } = this.props;
    const cxName = cx('component', 'clearfix', className);
    return (
      <header className={ cxName }>
        { this._renderTop() }
      </header>
    );
  }
}

export default SiteHeader;
