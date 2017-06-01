import React, { Component } from 'react';
import enableIntl from 'decorators/enable-intl';
import { observeGrid } from 'react-cellblock';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames';

@observeGrid
@injectContext
@enableIntl
class Settings extends Component {

  props: {
    breakpoint?: ?number,
    className: ?string,
    menuStyle: ?{}
  };

  componentWillMount() {
    this._ignoreBlur = false;
  }

  componentWillReceiveProps() {
    this._performAutoCompleteOnUpdate = true;
  }

  signOut = () => this.context.flux.getActions('userIdentity').signOut();

  render() {
    const { className } = this.props;
    // const isMobile = breakpoint <= 4;
    return (
      <div className={ classNames(className) }>
        <button onClick={ this.signOut }>
          { this.getIntlMessage('signOut') }
        </button>
      </div>
    );
  }
}

export default Settings;
