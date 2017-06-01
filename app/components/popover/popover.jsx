import React from 'react';
import classnames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

class Popover extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    trigger: React.PropTypes.any.isRequired,
    position: React.PropTypes.oneOf([ 'top', 'right', 'bottom', 'left' ]),
    onShow: React.PropTypes.func,
    onHide: React.PropTypes.func
  };

  static defaultProps = {
    position: 'top'
  };

  state = {
    isPopoverShown: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  show = () => {
    this.immune = true;
    this.setState({ isPopoverShown: true });
    if (this.props.onShow) {
      this.props.onShow();
    }
  };

  hide = () => {
    if (!this.immune) {
      this.setState({ isPopoverShown: false });
    }
    this.immune = false;
    if (this.props.onHide) {
      this.props.onHide();
    }
  };

  toggle = (e) => {
    e.preventDefault();
    if (this.state.isPopoverShown) {
      this.hide();
    } else {
      this.show();
    }
  };

  render() {
    const popoverClasses = classnames(
                            'popover',
                            this.props.className,
                            `popover--${this.props.position}`,
                            { 'popover--active': this.state.isPopoverShown }
                           );

    return (
      <div className={ popoverClasses }>
        <button onClick={ this.toggle } className='popover__trigger'>
          { this.props.trigger }
        </button>
        <div className='popover__content'>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Popover;
