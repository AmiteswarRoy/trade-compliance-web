import React, { Component } from 'react';
import enableIntl from 'decorators/enable-intl';
import injectContext from 'decorators/inject-context';
import { observeGrid } from 'react-cellblock';
import classNames from 'classnames/bind';
import shallowCompare from 'react-addons-shallow-compare';
import { FormattedDate } from 'react-intl';
import debug from 'debug';
import styles from './intl.css';

const cx = classNames.bind(styles);

@observeGrid
@injectContext
@enableIntl
class IntlViewer extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const now = this.context.identity.initialNow;
    const { intl } = this.context;
    const formatRelative = intl.formatRelative;
    const args = {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    };
    const formattedDate = intl.formatDate(new Date(1459832991883), args);

    debug('dev')(intl.formatDate);

    return (
      <div className='IntlViewer'>
        <div>{ this.i18n('back') }</div>
        <h2>Relative Time</h2>
        <div className={ cx('item') }>
          <div>{ formatRelative(now) }</div>
        </div>
        <div className={ cx('item') }>
          <div>{ formatRelative(now - 1000) }</div>
        </div>
        <div className={ cx('item') }>
          <div>{ formatRelative(now + (1000 * 60 * 60)) }</div>
        </div>
        <div className={ cx('item') }>
          <div>{ formatRelative(now - (1000 * 60 * 60 * 24)) }</div>
        </div>
        <div className={ cx('item') }>
          <div>{ formatRelative(now - (1000 * 60 * 60 * 24), { style: 'numeric' }) }</div>
        </div>
        <div className={ cx('item') }>
          <div>{ formatRelative(now - (1000 * 60 * 60 * 24), { units: 'hour' }) }</div>
        </div>

        <h2>Date Formatting : { formattedDate }</h2>
        <div className={ cx('item') }>
          <div>
            <FormattedDate
              value={ new Date(1459832991883) }
              year='numeric'
              month='long'
              day='2-digit' />
          </div>
        </div>
      </div>
    );
  }
}

export default IntlViewer;
