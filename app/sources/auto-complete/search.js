import settingsProvider from 'utils/settings-provider';
import axios from 'axios';
import helper from 'sources/utils/api/v3/helper';

export default {
  getResults({ suggestContext }, { searchString, maxResults = 100 }) {
    const baseUrl = settingsProvider.get('DOW_JONES_PIB.AUTO_COMPLETE_BASE_URL');
    const request = {
      url: `${baseUrl}/search/1.0/PrivateMarkets?`,
      method: 'get',
      timeout: settingsProvider.get('GENERAL.TIME_OUT'),
      params: {
        format: 'json',
        suggestContext,
        maxResults,
        searchText: searchString,
        autocompletionType: 'PrivateMarkets',
        showViewAllPrivateMarkets: true,
        types: 'pmdeal_company',
        pmDealProductDataSet: 'vs'
      }
    };

    return axios(request)
      .then(res => helper.normalize(res.data))
      .catch(res => Promise.reject(helper.getError(res.data)));
  }
};
