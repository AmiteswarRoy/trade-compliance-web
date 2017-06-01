import React, { Component } from 'react';
import { Row, observeGrid } from 'react-cellblock';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';
import imageResolver from 'utils/image-resolver';
import { Link } from 'react-router';

import styles from './header.css';

let djorganizationLogo;
let djorganizationLogoMobile;

/* istanbul ignore next */
if (process.env.BROWSER) {
  djorganizationLogo = require('images/dj-organization-logo.png');
  djorganizationLogoMobile = require('images/dj-avatar-blue.png');
} else {
  djorganizationLogo = imageResolver('images/dj-organization-logo.png');
  djorganizationLogoMobile = imageResolver('images/dj-avatar-blue.png');
}

const cx = classNames.bind(styles);

@observeGrid
@injectContext
class SiteHeader extends Component {

  props: {
    className: ?any,
    breakpoint?: ?number
  };

  _getFlags = () => {
    const { breakpoint } = this.props;
    return {
      isMobile: breakpoint <= 4
    };
  };

  _renderLogo = () => {
    const { isMobile } = this._getFlags();
    const to = 'http://www.dowjones.com/';
    const target = '_blank';
    const useMobile = isMobile;
    return (
      <Row className={ cx('top', 'clearfix') }>
        <div className={ cx('top-left', 'clearfix') }>
          <Link to={ to } target={ target } className={ cx(useMobile ? 'dj-logo-mobile' : 'dj-logo') }>
            <img src={ useMobile ? djorganizationLogoMobile : djorganizationLogo } alt='Dow Jones' />
          </Link>
        </div>
      </Row>
    );
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
    const cxName1 = cx('logocomponent', 'clearfix', className);
    return (
      <header>
        <div className={ cxName1 }> { this._renderLogo() } </div>
        <div className={ cxName }> { this._renderTop() } </div>
      </header>
    );
  }
}

export default SiteHeader;
