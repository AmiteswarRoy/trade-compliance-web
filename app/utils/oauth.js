import settingsProvider from 'utils/settings-provider';
import queryString from 'query-string';
import jsonp from 'jsonp';

const parseError = err =>
    (err && err.error) ? {
      code: err.error,
      message: err.error_description
    } : null;

export default {
  getAuthorizeUrl: (host, returnUrl) => {
    const oAuthSettings = settingsProvider.get('DOW_JONES_OAUTH');
    const isAuth0V2Enabled = settingsProvider.get('ENABLE_AUTH0_V2');
    const params = {
      redirect_uri: `${host}/oauthcallback`,
      'fwd.productname': oAuthSettings.PRODUCT_NAME,
      scope: oAuthSettings.AUTHORIZE_SCOPE,
      response_type: oAuthSettings.RESPONSE_TYPE,
      connection: oAuthSettings.CONNECTION
    };
    params.client_id = isAuth0V2Enabled ? oAuthSettings.CLIENT_ID : oAuthSettings.V1_CLIENT_ID;
    if (returnUrl) {
      const state = new Buffer(JSON.stringify({ returnUrl })).toString('base64');
      params.state = state;
    }
    const baseUrl = isAuth0V2Enabled ? oAuthSettings.BASE_URL : oAuthSettings.V1_BASE_URL;
    return `${baseUrl}/authorize?${queryString.stringify(params)}`;
  },

  getDelegationUrl: (idToken) => {
    const oAuthSettings = settingsProvider.get('DOW_JONES_OAUTH');
    const params = {
      client_id: oAuthSettings.CLIENT_ID,
      scope: oAuthSettings.DELEGATION_SCOPE,
      id_token: idToken,
      grant_type: oAuthSettings.GRANT_TYPE
    };
    return `${oAuthSettings.BASE_URL}/delegation?${queryString.stringify(params)}`;
  },

  parseCallbackParams: (hash) => {
    const params = queryString.parse(hash) || {};

    if (params.state) {
      try {
        params.state = JSON.parse(new Buffer(params.state, 'base64').toString('ascii'));
      } catch (e) {
        params.state = {};
      }
    }

    return {
      accessToken: params.access_token,
      idToken: params.id_token,
      state: params.state || {},
      error: parseError(params)
    };
  },

  parseError,

  signOut: accessToken =>
    new Promise((resolve) => {
      const oAuthSettings = settingsProvider.get('DOW_JONES_OAUTH');
      const url = `${oAuthSettings.V1_BASE_URL}/revoke?token=${accessToken}` +
                  '&token_type_hint=access_token';
      jsonp(url, null, (err, res) => {
        // Ignore the error
        resolve((res && res.exitUrl) ? res.exitUrl : settingsProvider.get('SIGN_OUT_EXIT_URL'));
      });
    }),

  getSignOutUrl: (accessToken) => {
    const oAuthSettings = settingsProvider.get('DOW_JONES_OAUTH');
    return `${oAuthSettings.SIGN_OUT_BASE_URL}/logout?token=${accessToken}` +
           `&token_type_hint=access_token&returnTo=${settingsProvider.get('SIGN_OUT_EXIT_URL')}`;
  }
};
