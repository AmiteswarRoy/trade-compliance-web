import React, { Component, PropTypes } from 'react';
import includes from 'lodash/includes';
import { Loader } from 'components/shared';

class HomePageLoader extends Component {

  static propTypes = {
    location: PropTypes.object
  };

  execStart = 0;
  execEnd = 0;
  loaderDuration = 1600;

  state = {
    completedAnimation: false,
    style: { zIndex: 10 }
  };

  componentDidMount() {
    this.handleResize();

    this.execEnd = Date.now();
    const delay = this.loaderDuration + (this.execEnd - this.execStart);
    setTimeout(() => {
      this.animationDone();
    }, delay);
  }

  animationDone = () => {
    const newState = Object.assign({}, this.state, { completedAnimation: true });
    this.setState(newState);
  }

  handleResize = () => {
    const style = Object.assign({}, this.state.style, {
      height: window.innerHeight
    });
    this.setState({ style });
  }

  render() {
    const isLoaderRoute = includes([ '/', '/home', '/oauthcallback' ],
                                   this.props.location.pathname);

    const isLoaderAction = includes([ 'POP', 'REPLACE' ],
                                    this.props.location.action);

    this.execStart = Date.now();

    return isLoaderRoute
      && isLoaderAction
      && !this.state.completedAnimation
      && <Loader useDJThrobber style={ this.state.style } />;
  }
}

export default HomePageLoader;
