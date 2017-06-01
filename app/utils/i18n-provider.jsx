import debug from 'debug';
import React, { Component, PropTypes } from 'react';
import { intlShape, defineMessages } from 'react-intl';
import moment from 'moment-timezone';
import settingsProvider from 'utils/settings-provider';

class I18nProvider extends Component {

  static propTypes = {
    timeZone: PropTypes.string,
    convertToLocalTime: PropTypes.bool,
    locales: PropTypes.array,
    children: PropTypes.node.isRequired
  };

  static childContextTypes = {
    i18n: PropTypes.func.isRequired,
    formatDate: PropTypes.func,
    formatTime: PropTypes.func,
    formatRelative: PropTypes.func,
    formatCalendar: PropTypes.func,
    formatNumber: PropTypes.func,
    convertToDate: PropTypes.func
  };

  static contextTypes = {
    intl: intlShape.isRequired
  };

  getChildContext = () => {
    const i18n = this._i18n;
    const formatDate = this._formatDate;
    const formatTime = this._formatTime;
    const formatRelative = this._formatRelative;
    const formatCalendar = this._formatCalendar;
    const formatNumber = this._formatNumber;
    const convertToDate = this._convertToDate;
    return {
      i18n,
      formatDate,
      formatTime,
      formatRelative,
      formatCalendar,
      formatNumber,
      convertToDate
    };
  };

  getLocale = () => {
    const locales = this.props.locales || this.context.locales;
    return (!!(locales && locales.length) && locales[0]) || 'en';
  };

  _formatDate = (date, formatStr) => {
    const defaultFormatStr = settingsProvider.get('date-format');
    const timeZone = this.props.timeZone || this.context.timeZone || 'America/New_York';
    moment.locale(this.getLocale());
    const convertToLocalTime = this.props.convertToLocalTime || this.context.convertToLocalTime;
    if (convertToLocalTime) {
      return moment(date).tz(timeZone).format(formatStr || defaultFormatStr);
    } else {
      return moment.utc(date).format(formatStr || defaultFormatStr);
    }
  };

  _formatTime = (date, formatStr) => {
    const timeZone = this.props.timeZone || this.context.timeZone || 'America/New_York';
    moment.locale(this.getLocale());
    return moment(date).tz(timeZone).format(formatStr || 'MMMM Do YYYY, h:mm:ss a z');
  };

  _formatRelative = (date) => {
    const timeZone = this.props.timeZone || this.context.timeZone || 'America/New_York';
    moment.locale(this.getLocale());
    return moment(date).tz(timeZone).fromNow();
  };

  _formatCalendar = (date) => {
    const timeZone = this.props.timeZone || this.context.timeZone || 'America/New_York';
    moment.locale(this.getLocale());
    return moment(date).tz(timeZone).calendar();
  };

  _formatNumber = (num, options) => {
    const locale = this.getLocale();
    const opts = Object.assign({ locales: locale }, options);
    return this.context.intl.formatNumber(num, opts);
  };

  _convertToDate = (value) => {
    const pattern = /Date\(([^)]+)\)/;
    const results = pattern.exec(value);
    return new Date(parseFloat(results[1]));
  };

  _i18n = (key, values) => {
    try {
      const { formatMessage, locale, messages } = this.context.intl;
      const messageObject = { };
      messageObject[locale] = {
        id: key,
        defaultMessage: messages[key]
      };

      return formatMessage({ messages: defineMessages(messageObject), id: key }, values);
    } catch (error) {
      debug('dev')(error);
      return `translation missing (${this.context.intl.locale}): ${key}`;
    }
  };

  render() {
    const { children } = this.props;
    return <span>{ children }</span>;
  }
}

export default I18nProvider;
