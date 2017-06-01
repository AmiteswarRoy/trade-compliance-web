import React, { Component } from 'react';
import { VelocityComponent } from 'velocity-react';
import { observeGrid } from 'react-cellblock';
import enableIntl from 'decorators/enable-intl';
import get from 'lodash/object/get';
import classNames from 'classnames/bind';
import styles from './page-slider.css';

const cx = classNames.bind(styles);

@observeGrid
@enableIntl
class PageSlider extends Component {

  props:{
    children?: ?any,
    colWidth?: ?number,
    show: ?boolean,
    className: ?any,
    close: ?Function,
    slideFrom: 'right' | 'bottom' | 'left' | 'top',
    onHideComplete: ?Function,
    onShowComplete: ?Function
  };

  static defaultProps = {
    show: false,
    slideFrom: 'top',
    onClose: () => ({}),
    onHideComplete: () => ({}),
    onShowComplete: () => ({})
  };

  state = {
    open: false,
    sliderStyle: {}
  };

  handleResize = () => {
    const height = window.innerHeight;
    this.setState({
      sliderStyle: { height }
    });
  }

  _getMarginTop = () => {
    const sliderElParent = get(this, 'refs.pageSlider.offsetParent');
    return this.props.slideFrom === 'top' && sliderElParent
      ? `-${sliderElParent.getBoundingClientRect().top}px`
      : '0%';
  }

  componentDidMount() {
    this._addListeners();
  }

  componentWillUnmount() {
    this._removeListeners();
  }

  _addListeners = () => {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeydown);
  }

  _removeListeners = () => {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeydown);
  }

  calculateSlidingStyle = () => {
    switch (this.props.slideFrom) {
    case 'left':
      return {
        hidden: { marginLeft: '-110%', opacity: 0 },
        shown: { marginLeft: '0%', opacity: 1 }
      };
    case 'right':
      return {
        hidden: { marginLeft: '110%', opacity: 0 },
        shown: { marginLeft: '0%', opacity: 1 }
      };
    case 'top':
      return {
        hidden: { marginTop: '-110%', opacity: 0 },
        shown: { marginTop: this._getMarginTop(), opacity: 1 }
      };
    case 'bottom':
    default:
      return {
        hidden: { marginTop: '110%', opacity: 0 },
        shown: { marginTop: this._getMarginTop(), opacity: 1 }
      };
    }
  };

  calculateOuterStyle = () => {
    const behaviour = this.calculateSlidingStyle();
    return this.props.show ? behaviour.shown : behaviour.hidden;
  };

  handleKeydown = (ev) => {
    if (ev.keyCode === 27 && this.props.close) {
      this.props.close(ev);
    }
  };

  onVelocityBegin = () => {
    if (!this.state.open) {
      this.handleResize();
    }
  };

  onVelocityComplete = () => {
    if (this.props.show) {
      this.setState({ open: true });
      this._addListeners();
      this.props.onShowComplete();
      document.body.style.overflow = 'hidden';
    } else {
      this.setState({
        open: false,
        sliderStyle: {}
      });
      this._removeListeners();
      if (this.props.onHideComplete) {
        this.props.onHideComplete();
      }
      document.body.style.overflow = 'auto';
    }
  };

  render() {
    // extract only styles that are needed
    const outerStyle = this.calculateOuterStyle();
    const closeDiv = () => (!!this.props.close &&
      <button className={ cx('close-button') } onClick={ this.props.close }>&times;</button>);
    const { colWidth, className } = this.props;
    const cxName = cx('component', `colwidth-${colWidth}`, className);

    return (
      <VelocityComponent
        animation={ outerStyle } duration={ 400 }
        easing='swing' begin={ this.onVelocityBegin } complete={ this.onVelocityComplete }>
        <div
          ref={ n => (this.pageSlider = n) }
          className={ cxName }
          style={ this.state.sliderStyle }>
          { closeDiv() }
          <div className={ cx('content') }>
            { this.props.children }
          </div>
        </div>
      </VelocityComponent>
    );
  }
}

export default PageSlider;
