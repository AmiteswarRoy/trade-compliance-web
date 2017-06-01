import axios from 'axios';
import settingsProvider from 'utils/settings-provider';
import helper from 'sources/utils/api/v3/helper';

const ENABLE_AUTH0_V2 = settingsProvider.get('ENABLE_AUTH0_V2');
const baseUrl = ENABLE_AUTH0_V2 ?
                  settingsProvider.get('DOW_JONES_PIB.API_3_0_BASE_URL') :
                  settingsProvider.get('DOW_JONES_PIB.API_BASE_URL');
const entitlementsUrl = baseUrl + (ENABLE_AUTH0_V2 ? '/users/entitlements' : '/user/entitlements');
const timeout = settingsProvider.get('GENERAL.TIME_OUT');

export default {
  getEntitlements({ accessToken }) {
    const request = {
      url: entitlementsUrl,
      method: 'get',
      headers: Object.assign({}, helper.attachAccessToken(accessToken)),
      timeout,
      params: {
        parts: [
          'userinfo',
          'venturesource'
        ]
      }
    };

    return axios(request)
      .then(res => helper.normalize(res.data))
      .catch(res => Promise.reject(helper.getError(res.data)));
  },

  getAccessTokenFromDelegation({ url }) {
    const request = {
      url,
      method: 'get',
      timeout
    };

    return axios(request)
      .then(res => helper.normalize(res.data))
      .catch(res => Promise.reject(helper.getError(res.data)));
  },

  isValid({ accessToken }) {
    const request = {
      url: entitlementsUrl,
      method: 'get',
      headers: Object.assign({}, helper.attachAccessToken(accessToken)),
      timeout
    };

    return axios(request)
      .then(res => helper.normalize(res.data))
      .catch(res => Promise.reject(helper.getError(res.data)));
  }
};
