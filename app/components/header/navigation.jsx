import React, { Component } from 'react';
import { observeGrid } from 'react-cellblock';
import enableIntl from 'decorators/enable-intl';
import injectContext from 'decorators/inject-context';
import { Link } from 'react-router';
import LangPicker from 'components/shared/lang-picker';

@observeGrid
@injectContext
@enableIntl

class GeneralNavigation extends Component {

  componentWillMount() {
    this._ignoreBlur = false;
  }

  componentWillReceiveProps() {
    this._performAutoCompleteOnUpdate = true;
  }

  signOut = () => this.context.flux.getActions('userIdentity').signOut();

  handleLocaleChange = (locale: string) => {
    this.getActions('locale').switchLocale({ locale });
  }

  render() {
    // const isMobile = breakpoint <= 4;
    const { locales: [ activeLocale ] } = this.context;

    return (
      <nav>
        <ul>
          <li><Link to='/showcase'>{ this.i18n('showcase') }</Link></li>
          <li><Link to='/intl'>{ this.i18n('internationalization') }</Link></li>
        </ul>

        { /* LangPicker on the right side */ }
        <LangPicker
          activeLocale={ activeLocale }
          onChange={ this.handleLocaleChange } />
      </nav>
    );
  }
}

export default GeneralNavigation;
