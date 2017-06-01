import { PropTypes } from 'react';
import { intlShape } from 'react-intl';

/* eslint-disable react/require-render-return */
export default Component => class extends Component {
  static displayName = Component.displayName;

  static contextTypes = Object.assign(
    {},
    Component.contextTypes,
    {
      messages: PropTypes.object,
      locales: PropTypes.array,
      timeZone: PropTypes.string,
      i18n: PropTypes.func,
      formatDate: PropTypes.func,
      formatTime: PropTypes.func,
      formatRelative: PropTypes.func,
      formatCalendar: PropTypes.func,
      formatNumber: PropTypes.func,
      convertToDate: PropTypes.func,
      intl: intlShape
    });

  getIntlMessage = key => (this.context.i18n(key));
  i18n = (key, values) => (this.context.i18n(key, values));
  formatDate = (date, formatStr) => (this.context.formatDate(date, formatStr));
  formatTime = (date, formatStr) => (this.context.formatTime(date, formatStr));
  formatRelative = date => (this.context.formatRelative(date));
  formatCalendar = date => (this.context.formatCalendar(date));
  formatNumber = (num, options) => (this.context.formatNumber(num, options));
  convertToDate = value => (this.context.convertToDate(value));
};

