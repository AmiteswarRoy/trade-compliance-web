import React, { Component } from 'react';
import UserSource from 'sources/user';
import { observeGrid } from 'react-cellblock';
import oAuth from 'utils/oauth';
import enableIntl from 'decorators/enable-intl';
import injectContext from 'decorators/inject-context';
import { PageError } from 'components/shared';
import get from 'lodash/get';
import settingsProvider from 'utils/settings-provider';

@observeGrid
@injectContext
@enableIntl
class oAuthCallback extends Component {
  props: {
    history: {
      replaceState: Function
    },
    location: {}
  };

  state = {
    hasAccess: true
  };

  defaultLandingPage = '/home';

  componentWillMount() {
    if (process.env.BROWSER) {
      const { location } = this.props;
      const oAuthCallbackParams = oAuth.parseCallbackParams(location.hash);
      const { accessToken, idToken, state, error } = oAuthCallbackParams;
      if (error) {
        this.setState({ error });
        return;
      }
      this.setState({ ...state });
      const isAuth0V2Enabled = settingsProvider.get('ENABLE_AUTH0_V2');
      if (isAuth0V2Enabled) {
        const url = oAuth.getDelegationUrl(idToken);
        UserSource.getAccessTokenFromDelegation({ url })
          .then(this._handleDelegationResponse)
          .catch(err => this.setState({ error: err }));
      } else {
        this._getEntitlements(accessToken);
      }
    }
  }

  _handleDelegationResponse = (response) => {
    if (!response) {
      this.setState({ error: response });
    } else {
      this._getEntitlements(response.idToken);
    }
  }

  _getEntitlements = (accessToken) => {
    this.setState({ accessToken });
    UserSource.getEntitlements({ accessToken })
      .then(this._handleEntitlementsResponse)
      .catch(err => this.setState({ error: err }));
  }

  _handleEntitlementsResponse = (response) => {
    if (!response || response.code) {
      this.setState({ error: response });
    } else {
      // Check if user has access to Venture Source
      const isVenturesourceEnabled = get(response, 'ventureSourceEntitlements.isVenturesourceEnabled');
      let researchCenterRequestFromLegacyPM = false;
      if (!isVenturesourceEnabled) {
        researchCenterRequestFromLegacyPM = get(response, 'ventureSourceEntitlements.isResearchCenterEnabled')
                                            && /researchcenter/i.test(this.state.returnUrl);
      }
      if (isVenturesourceEnabled || researchCenterRequestFromLegacyPM) {
        const { locales } = this.context;
        const [ interfaceLanguage ] = locales;
        const actions = this.getActions('userIdentity');
        actions.setIdentity({
          accessToken: this.state.accessToken,
          interfaceLanguage,
          forLegacyResearchCenter: !isVenturesourceEnabled && researchCenterRequestFromLegacyPM
        });

        if (!isVenturesourceEnabled && researchCenterRequestFromLegacyPM) {
          location.href = this.state.returnUrl;
        } else {
          actions.getEntitlementsSuccess(response);
          this.props.history
                      .replaceState(null, this.state.returnUrl || this.defaultLandingPage, null);
        }
      } else {
        this.setState({ hasAccess: false });
      }
    }
  }

  render() {
    let errorMessage;
    const error = this.state.error;
    if (error) {
      errorMessage = `${error.message} (${this.getIntlMessage('error')} : ${error.code})`;
    }
    if (!this.state.hasAccess) {
      errorMessage = this.getIntlMessage('noAccessToVS');
    }
    return !!errorMessage && <PageError errorMessage={ errorMessage } />;
  }
}

export default oAuthCallback;
