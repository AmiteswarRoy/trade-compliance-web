import React, { Component } from 'react';
import { Row, observeGrid } from 'react-cellblock';
import { Link } from 'react-router';
import imageResolver from 'utils/image-resolver';
import enableIntl from 'decorators/enable-intl';
import injectContext from 'decorators/inject-context';
import includes from 'lodash/includes';
import classNames from 'classnames/bind';

import Settings from './settings';
import Navigation from './navigation';
import styles from './header.css';

/* istanbul ignore next */
if (process.env.BROWSER) {
  djorganizationLogo = require('images/dj-organization-logo.png');
  djorganizationLogoMobile = require('images/dj-avatar-blue.png');
  reactLogo = require('images/react-logo.png');
  reactLogoMobile = require('images/react-logo.png');
  djorganizationHelp = require('images/dj-organization-help.png');
} else {
  djorganizationLogo = imageResolver('images/dj-organization-logo.png');
  djorganizationLogoMobile = imageResolver('images/dj-avatar-blue.png');
  reactLogo = imageResolver('images/react-logo.png');
  reactLogoMobile = imageResolver('images/react-logo.png');
  djorganizationHelp = imageResolver('images/dj-organization-help.png');
}

const cx = classNames.bind(styles);

@observeGrid
@injectContext
@enableIntl
class SiteHeader extends Component {

  props: {
    breakpoint?: ?number,
    entitled?: ?boolean,
    location: ?{
      pathname: ?string,
    },
    nodeRef: ?() => void,
    className: ?any,
    entityHeader?: ?{},
    inProgress: ?boolean,
    suggestions: ?{}
  };
  
  _renderTop = () => {
    return (
      <Row className={ cx('top', 'clearfix') }>
        <div className={ cx('top-left', 'clearfix') }>
          Risk and Trade Complaince 
        </div>
      </Row>
    );
  };

  _renderNavigation = () => {
    const { isMobile, showEntityHeader } = this._getFlags();
    const w = (3 / this.props.breakpoint) * 100;
    const wrapStyle = (!isMobile && showEntityHeader) ? { marginLeft: `${w}%` } : {};
    return (
      <div className={ cx('search-wrap') } style={ wrapStyle }>
        { !isMobile && !showEntityHeader && (
          <div className={ cx('logo-search') } style={ { width: `${w}%` } }>
            <div className={ cx('logo-wrap') }>{ this._renderProductLogo() }</div>
            <Navigation />
          </div>)
        }
      </div>
    );
  };

  render() {
    const { className } = this.props;
    const isHomepage = this._isHomepage();
    const cxName = cx('component', 'clearfix', className, {
      homepage: isHomepage,
      animate: breakpoint > 4
    });

    return (
      <header className={ cxName }>
        { this._renderTop() }
      </header>
    );
  }
}

export default SiteHeader;
