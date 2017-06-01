import humps from 'humps';
import get from 'lodash/get';

export default {
  // helper function to process v3 error and return a consistant error message
  // in { code, message }
  getError: (data) => {
    const error = get(data, 'errors[0]', { code: -1 });
    return { code: error.code, message: error.title || '' };
  },

  attachAccessToken: accessToken => (
    { Authorization: `Bearer ${accessToken}` }
  ),

  normalize: (data, path, doNotNormalizeArray) => {
    if (!data) return data;
    const normalizedData = humps.camelizeKeys(data);
    const pathToProperty = path || 'data.attributes';

    if (!doNotNormalizeArray && Array.isArray(normalizedData.data)) {
      return normalizedData.data;
    }

    return get(normalizedData, pathToProperty, normalizedData);
  }
};
