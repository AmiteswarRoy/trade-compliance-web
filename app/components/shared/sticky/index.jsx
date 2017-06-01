import React, { Component } from 'react';
import { observeGrid } from 'react-cellblock';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import classNames from 'classnames';

@observeGrid
class Sticky extends Component {

  props: {
    children: ?any,
    className: ?string,
    colWidth: ?number,
    cssStyles: ?{},
    fullWidth: ?bool
  };

  static defaultProps = {
    fullWidth: true
  };

  state = {
    styles: { zIndex: 2, ...this.props.cssStyles }
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
    // Call the resize again after giving enough sometime for other components to load
    setTimeout(() => this._onResize(), 100);
  }

  componentWillUnmount() {
    this._clearNextSiblingMargin();
    window.removeEventListener('resize', this._onResize);
  }

  componentDidUpdate() {
    this._setNextSiblingMargin();
  }

  _getNextSibling = () => get(this, '_component.nextElementSibling')

  _clearNextSiblingMargin = () => {
    const nextSibling = this._getNextSibling();
    if (nextSibling) {
      nextSibling.style.marginTop = null;
      nextSibling.removeAttribute(`original-margin-${this.props.colWidth}`);
    }
  }

  _setNextSiblingMargin = debounce(() => {
    const nextSibling = this._getNextSibling();
    if (nextSibling) {
      nextSibling.style.marginTop = null;
      const height = this._component.offsetHeight
                     + this._getNextSiblingMarginTop()
                     + this._getPreviousSiblingsHeight();
      nextSibling.style.marginTop = `${height}px`;
    }
  }, 10)

  _getNextSiblingMarginTop() {
    const key = `original-margin-${this.props.colWidth}`;
    const nextSibling = this._getNextSibling();
    let originalMarginTop = nextSibling.getAttribute(key);
    if (originalMarginTop === null) {
      originalMarginTop = this._getComputedStyle(nextSibling, 'marginTop', 0);
      nextSibling.setAttribute(key, originalMarginTop);
    }
    return parseInt(originalMarginTop, 10);
  }

  _getComputedStyle(elem, style, defaultValue) {
    if (elem) {
      const computedStyle = (!!window.getComputedStyle && window.getComputedStyle(elem, null))
                            || elem.currentStyle;
      if (computedStyle) {
        return style ? computedStyle[style] : computedStyle;
      }
      return defaultValue;
    }
    return '';
  }

  _getPreviousSiblingsHeight() {
    let height = 0;
    const component = this._component;
    if (component.parentElement) {
      let node = component.parentElement.firstChild;
      while (node && node.nodeType === 1 && node !== component) {
        height += node.offsetHeight;
        node = node.nextSibling;
      }
    }
    return height;
  }

  _getCombinedPadding(elem) {
    const computedStyles = this._getComputedStyle(elem);
    const pLeft = parseInt(computedStyles.paddingLeft || 0, 10);
    const pRight = parseInt(computedStyles.paddingRight || 0, 10);
    return (pLeft + pRight);
  }

  _onResize = debounce(() => {
    const domNode = this._component;
    if (domNode && domNode.parentElement) {
      const { parentElement } = domNode;
      this.setState({
        styles: {
          position: 'fixed',
          width: this.props.fullWidth ?
                  '100%' :
                  parentElement.offsetWidth - this._getCombinedPadding(parentElement),
          ...this.state.styles
        }
      });
    }
  }, 10).bind(this);

  render() {
    return (
      <div
        ref={ (comp) => { this._component = comp; } }
        className={ classNames('sticky', this.props.className) }
        style={ this.state.styles }>
        { this.props.children }
      </div>
    );
  }
}

export default Sticky;
