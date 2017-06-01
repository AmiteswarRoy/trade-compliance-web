import React, { Component } from 'react';
import imageResolver from 'utils/image-resolver';
import { observeGrid } from 'react-cellblock';
import classNames from 'classnames/bind';
import injectContext from 'decorators/inject-context';
import enableIntl from 'decorators/enable-intl';
import styles from './footer.css';

const cx = classNames.bind(styles);

// get the avatar logo for Dow Jones
const djAvatarLogo = process.env.BROWSER ?
  require('images/dj-logo-grey.png') :
  imageResolver('images/dj-logo-grey.png');

@observeGrid
@injectContext
@enableIntl
class SiteFooter extends Component {

  props: {
    breakpoint?: ?number,
    className: ?any,
    showPopup: ?boolean
  };

  state = { showPopup: this.props.showPopup };

  closePopover = () => !!this.state.showPopup && this.toggleShowPopup();

  toggleShowPopup = () => this.setState({ showPopup: !this.state.showPopup });

  render() {
    const props = this.props;
    const { breakpoint, className } = props;
    const cxName = cx('component', `breakpoint-${breakpoint}`, className);
    const token = this.getIntlMessage('odeCopyRightDJ');
    const cr = `${new Date().getFullYear()} Dow Jones & Company, Inc. ${token}`;

    return (
      <footer className={ cxName }>
        <ul>
          <li>
            <a
              href='//djlogin.dowjones.com/PrivacyPolicy/Default.aspx?fcpil=en&productname=pevc'
              rel='noopener noreferrer'
              target='_blank'
              className={ cx('privacy-policy') }>
              { this.getIntlMessage('privacyPolicy') }
            </a>
          </li>
          <li>
            <a
              href='//djlogin.dowjones.com/UOC/Default.aspx?fcpil=en&productname=pevc'
              rel='noopener noreferrer'
              target='_blank'
              className={ cx('cookie-policy') }>
              { this.getIntlMessage('cookiePolicy') }
            </a>
          </li>
          <li>
            <a
              className={ cx('contact-us') }
              ref={ (node) => { this.contactus = node; } }>
              { this.getIntlMessage('npContactUs') }
            </a>
          </li>
        </ul>
        <div className={ cx('about') } >
          &copy; { cr }
          <img src={ djAvatarLogo } alt={ this.getIntlMessage('dowJones') } />
        </div>
      </footer>
    );
  }
}

export default SiteFooter;
