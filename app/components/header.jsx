import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import { Link } from 'react-router';

import imageResolver from 'utils/image-resolver';
import Spinner from 'components/shared/spinner';
import LangPicker from 'components/shared/lang-picker';

// Load styles for the header
// and load the `react-logo.png` image
// for the `<img src='' />` element
let reactLogo;
/* istanbul ignore next */
if (process.env.BROWSER) {
  reactLogo = require('images/react-logo.png');
} else {
  reactLogo = imageResolver('images/react-logo.png');
}

@connect(({ requests: { inProgress } }) =>
  ({ inProgress }))
class Header extends Component {

  props: {
    inProgress: ?boolean
  }

  static contextTypes = {
    locales: PropTypes.array.isRequired,
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  handleLocaleChange = (locale: string) => {
    const { flux } = this.context;
    flux.getActions('locale').switchLocale({ locale });
  }

  handleLogout = () => {
    const { flux } = this.context;
    flux.getActions('session').logout();
  }

  render() {
    const { inProgress } = this.props;
    const { locales: [ activeLocale ], i18n } = this.context;

    return (
      <header className='app--header'>
        { /* Spinner in the top right corner */ }
        <Spinner active={ inProgress } />

        { /* LangPicker on the right side */ }
        <LangPicker
          activeLocale={ activeLocale }
          onChange={ this.handleLocaleChange } />

        { /* React Logo in header */ }
        <Link to='/' className='app--logo'>
          <img src={ reactLogo } alt='react-logo' />
        </Link>

        { /* Links in the navbar */ }
        <ul className='app--navbar reset-list un-select'>
          <li>
            <Link to='/users'>
              { i18n('header.users') }
            </Link>
          </li>
          <li>
            <Link to='/guides'>
              { i18n('header.guides') }
            </Link>
          </li>
        </ul>
      </header>
    );
  }
}

export default Header;
