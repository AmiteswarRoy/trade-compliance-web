/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import connect from 'connect-alt';
import SiteHeader from 'tradecomponents/header/';
import ReactI13nTealium from 'i13n/tealium/index';
import { setupI13n } from 'react-i13n';
import { Grid } from 'react-cellblock';
import settingsProvider from 'utils/settings-provider';
import styles from 'styles/app.css';
import classNames from 'classnames/bind';
import debug from 'debug';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Sticky } from 'components/shared';
import injectContext from 'decorators/inject-context';
import 'styles/app.global.css';

injectTapEventPlugin();

const cx = classNames.bind(styles);
const reactI13nTealium = new ReactI13nTealium();

@connect('ui', 'requests')
@injectContext
class App extends Component {

  props: {
    children?: ?any,
    location: {},
    params?: ?{},
    uiStore: {
      bodyHeight: ?number
    },
    requestsStore: {
      inProgress?: ?boolean
    }
  };

  state = {
    bodyHeight: this.props.uiStore.bodyHeight
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResizeDebounced);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeDebounced);
  }

  handleResize = () => {
    let height = window.innerHeight;
    const footerEl = this._footerRef;
    height -= footerEl ? footerEl.getBoundingClientRect().height : 0;
    debug('dev')(`app handleResize, setting bodyHeight: ${height}`);
    this.getActions('ui').updateProperty('bodyHeight', height);
    this.setState({ bodyHeight: height });
  };

  handleResizeDebounced = debounce(this.handleResize, 150);

  onChange = (breakpoint) => {
    if (this.context.identity.initialBreakpoint !== breakpoint) {
      debug('dev')('breakpoint:changed', breakpoint);
      this.getActions('userIdentity').setInitialBreakpoint(breakpoint);
    }
  };

  render = () => {
    const { children, location } = this.props;
    const { identity } = this.context;
    const entitlements = get(identity, 'entitlements');
    const initialBreakpoint = get(identity, 'initialBreakpoint');
    const props = { location, entitlements };
    const params = { key: location.pathname, ...props };
    const { bodyHeight } = this.state;
    const bodyStyle = bodyHeight ? { height: bodyHeight } : null;
    const clonedChildren = () => (
      React.Children.map(children, child => React.cloneElement(child, params))
    );

    return (
      <Grid
        columnWidth={ 60 }            // a “grid unit” is at least 60px wide
        initialBreakpoint={ initialBreakpoint }
        onChange={ this.onChange }
        flexible={ [ 4, 8, 12, 16 ] }
        className='react-cellblock'>
        <Sticky cssStyles={ { zIndex: 3, top: 0 } }>
          <SiteHeader entitled={ !!entitlements } />
        </Sticky>
        <ReactCSSTransitionGroup
          component='div'
          transitionName='reversePageSwap'
          transitionEnterTimeout={ 600 }
          transitionLeaveTimeout={ 600 }>
          <div
            id='app-body'
            className={ cx('body', `breakpoint-${initialBreakpoint || 16}`) }
            style={ bodyStyle }>
            { clonedChildren() }
          </div>
        </ReactCSSTransitionGroup>
      </Grid>
    );
  };

}

export default (settingsProvider.get('i13N.ENABLED')) ?
                setupI13n(App, {}, [ reactI13nTealium.getPlugin() ]) :
                App;
