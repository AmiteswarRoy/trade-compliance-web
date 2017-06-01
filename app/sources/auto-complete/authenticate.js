import settingsProvider from 'utils/settings-provider';
import axios from 'axios';
import helper from 'sources/utils/api/v3/helper';

export default {
  getSuggestToken(accessToken) {
    const baseUrl = settingsProvider.get('DOW_JONES_PIB.AUTO_COMPLETE_BASE_URL');
    const request = {
      url: `${baseUrl}/authenticate/1.0/registerUsingSessionId?`,
      method: 'get',
      timeout: settingsProvider.get('GENERAL.TIME_OUT'),
      params: {
        format: 'json',
        sid: accessToken
      }
    };

    return axios(request)
      .then(res => helper.normalize(res.data))
      .catch(res => Promise.reject(helper.getError(res.data)));
  }
};
