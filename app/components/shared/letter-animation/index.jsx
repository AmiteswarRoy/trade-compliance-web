import React, { Component } from 'react';
import random from 'lodash/random';
import sampleSize from 'lodash/sampleSize';
import FlipMove from 'react-flip-move';
import classNames from 'classnames/bind';
import styles from './letter-animation.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const cx = classNames.bind(styles);

function getSubsetOfAlphabet() {
  const numToPick = random(1, 26);
  return sampleSize(alphabet, numToPick).sort();
}

class LetterAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: alphabet
    };
  }

  componentWillMount() {
    this.interval = window.setInterval(() => {
      this.setState({
        letters: getSubsetOfAlphabet()
      });
    }, 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  onStart({ entering, leaving }, node) {
    if (entering) {
      node.classList.add(cx('enter'));
    } else if (leaving) {
      node.classList.add(cx('leave'));
    } else {
      node.classList.remove(cx('enter'), cx('leave'));
    }
  }

  renderLetters() {
    return this.state.letters.map(letter => (
      <span key={ letter }>{ letter }</span>
    ));
  }

  render() {
    const animations = {
      enterAnimation: {
        from: {
          transform: 'translateY(-30px)',
          opacity: 0
        },
        to: {
          transform: 'translateY(0)',
          opacity: 1
        }
      },
      leaveAnimation: {
        from: {
          transform: 'translateY(0)',
          opacity: 1
        },
        to: {
          transform: 'translateY(30px)',
          opacity: 0
        }
      }
    };

    return (
      <div className={ cx('letter-demo') }>
        <FlipMove
          duration={ 750 }
          easing='ease'
          onStart={ this.onStart }
          { ...animations }
          { ...this.props } >
          { this.renderLetters() }
        </FlipMove>
      </div>
    );
  }
}

export default LetterAnimation;
