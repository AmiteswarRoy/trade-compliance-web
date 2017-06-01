import { PropTypes } from 'react';
import settingsProvider from 'utils/settings-provider';

const source = settingsProvider.get('i13N.PAGE_SITE');

/* eslint-disable react/require-render-return */
export default Component => class extends Component {
  static displayName = Component.displayName;

  static contextTypes = Object.assign(
    {},
    Component.contextTypes,
    {
      router: PropTypes.object,
      flux: PropTypes.object,
      messages: PropTypes.object,
      locales: PropTypes.array,
      identity: PropTypes.object,
      timeZone: PropTypes.string
    });

  generateViewPayload = (type = '', section = '', subsection = '') => {
    const { identity } = this.context;
    return {
      identity,
      view: {
        content: { type, source },
        section,
        subsection
      }
    };
  };

  getActions = action => this.context.flux.getActions(action);
  getStore = store => this.context.flux.getStore(store);
};
