/* eslint max-len: 0 */
import React, { Component } from 'react';
import imageResolver from 'utils/image-resolver';

import enableIntl from 'decorators/enable-intl';

/* istanbul ignore next */
const djAvatarLogo = process.env.BROWSER
                      ? require('images/dj-logo-grey.png')
                      : imageResolver('images/dj-logo-grey.png');

@enableIntl
class Footer extends Component {

  static propTypes = {
  }

  render() {
    return (
      <footer className='app--footer'>
        <div className='app--footer-content'>
          &copy; { new Date().getFullYear() } Dow Jones & Company, Inc. { this.getIntlMessage('odeCopyRightDJ') }
          <img src={ djAvatarLogo } alt={ this.getIntlMessage('dowJones') } />
        </div>
      </footer>
    );
  }

}

export default Footer;
