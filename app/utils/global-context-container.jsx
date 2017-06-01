import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';
import { IntlProvider } from 'react-intl';
import { get } from 'lodash';
import debug from 'debug';
import I18nProvider from './i18n-provider';

const getLocale = (locales) => {
  debug('dev')(locales);
  const locale = get(locales, '[0]', 'en');
  switch (locale.toLowerCase()) {
  case 'zhtw':
    return 'zh-Hant-TW';
  case 'zhcn':
    return 'zh-Hans-CN';
  default:
    return locale;
  }
};

@connect(({
    userIdentity: { identity },
    locale: { locales, messages, formats },
    helmet: { title }
  }) => ({ identity, locales, messages, formats, title }))
class GlobalContextContainer extends Component {

  static propTypes = {
    identity: PropTypes.object.isRequired,
    locales: PropTypes.array.isRequired,
    messages: PropTypes.object.isRequired,
    formats: PropTypes.object.isRequired,
    timeZone: PropTypes.string,
    convertToLocalTime: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    initialNow: PropTypes.any
  };

  static contextTypes = {
    flux: PropTypes.object.isRequired
  };

  static childContextTypes = {
    identity: PropTypes.object,
    messages: PropTypes.object.isRequired,
    formats: PropTypes.object.isRequired,
    locales: PropTypes.array.isRequired,
    timeZone: PropTypes.string,
    convertToLocalTime: PropTypes.bool
  };

  shouldComponentUpdate = (nextProps) => {
    if (this.props.title !== nextProps.title) {
      document.title = nextProps.title;
      return false;
    }
    return true;
  };

  getChildContext = () => {
    const { identity, messages, locales, formats, convertToLocalTime } = this.props;
    const timeZone = identity.timeZone;
    return { messages, locales, identity, timeZone, formats, convertToLocalTime };
  };

  render() {
    const { children, locales, formats, messages, identity: { initialNow } } = this.props;
    return (
      <IntlProvider
        locale={ getLocale(locales) }
        messages={ messages }
        formats={ formats }
        initialNow={ initialNow } >
        <I18nProvider>
          { children }
        </I18nProvider>
      </IntlProvider>
    );
  }

}

export default GlobalContextContainer;
