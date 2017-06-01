import React, { Component, PropTypes } from 'react';
import enableIntl from 'decorators/enable-intl';
import { observeGrid } from 'react-cellblock';
import injectContext from 'decorators/inject-context';
import Sticky from 'components/shared/sticky';

@observeGrid
@injectContext
@enableIntl
class MockStickyComponent extends Component {
  static propTypes = {
    noSibling: PropTypes.bool
  };
  render() {
    const props = this.props;
    const { noSibling } = props;
    if (noSibling === true) {
      return (
        <Sticky cssStyles={ { zIndex: 3, top: 0 } }>
          <div className='mock-component' style={ { width: '200px' } }>
            <ul>
              <li><a href='/'>{ this.getIntlMessage('riskDatabase') }</a></li>
              <li><a href='/'>{ this.i18n('corporateSearch') }</a></li>
              <li><a href='/'>{ this.formatNumber(100000) }</a></li>
            </ul>
          </div>
        </Sticky>
      );
    } else {
      return (
        <div>
          <Sticky cssStyles={ { zIndex: 3, top: 0 } }>
            <div className='mock-component' style={ { width: '200px' } }>
              <ul>
                <li><a href='/'>{ this.getIntlMessage('riskDatabase') }</a></li>
                <li><a href='/'>{ this.i18n('corporateSearch') }</a></li>
                <li><a href='/'>{ this.formatNumber(100000) }</a></li>
              </ul>
            </div>
          </Sticky>
          <div>
            <ul>
              <li><a href='/'>{ this.getIntlMessage('riskDatabase') }</a></li>
              <li><a href='/'>{ this.i18n('corporateSearch') }</a></li>
              <li><a href='/'>{ this.formatNumber(100000) }</a></li>
            </ul>
          </div>
        </div>
      );
    }
  }
}

export default MockStickyComponent;
