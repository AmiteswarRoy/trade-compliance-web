import React, { Component, PropTypes } from 'react';
import enableIntl from 'decorators/enable-intl';
import { observeGrid } from 'react-cellblock';
import injectContext from 'decorators/inject-context';
import settingsProvider from 'utils/settings-provider';

const source = settingsProvider.get('i13N.PAGE_SITE');

@observeGrid
@injectContext
@enableIntl
class MockComponent extends Component {

  static propTypes = {
    section: PropTypes.string,
    subsection: PropTypes.string,
    type: PropTypes.string
  }

  render() {
    const date = this.convertToDate(/Date(1224043200000)/);
    const { type, section, subsection } = this.props;
    const payload = this.generateViewPayload(type, section, subsection);

    return (
      <div className='mock-component'>
        <ul>
          <li><a href='/'>{ this.getIntlMessage('riskDatabase') }</a></li>
          <li><a href='/'>{ this.i18n('corporateSearch') }</a></li>
          <li><a href='/'>{ this.formatNumber(100000) }</a></li>
          <li><a href='/'>{ this.formatTime('2014-04-25T01:32:21.196Z') }</a></li>
          <li><a href='/'>{ this.formatDate(date) }</a></li>
          <li><a href='/'>{ this.formatRelative('2014-04-25T01:32:21.196Z') }</a></li>
          <li><a href='/'>{ this.formatCalendar('2014-04-25T01:32:21.196Z') }</a></li>
          <li><a href='/'>{ payload.view.content.type === 'test' }</a></li>
          <li><a href='/'>{ payload.view.content.source === source }</a></li>
          <li><a href='/'>{ payload.view.section === 'test' }</a></li>
          <li><a href='/'>{ payload.view.subsection === 'test' }</a></li>
        </ul>
      </div>
    );
  }
}

export default MockComponent;
