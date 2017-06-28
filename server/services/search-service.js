import axios from 'axios';
import settingsProvider from 'utils/settings-provider';
import helper from 'sources/utils/api/v3/helper';
import { union } from 'lodash'
let searchService = {};

searchService.search = async (ctx) => {
  console.log('In search entry: ');
  const body = ctx.request.body
  console.log(JSON.stringify(body));
  const baseUrl = settingsProvider.get('TRADES_COMPLIANCE.API_URL');
  const request = {
    url: `${baseUrl}/search`,
    method: 'post',
    timeout: settingsProvider.get('GENERAL.TIME_OUT'),
    data:  body
  };
  await _fetchData(request)
  .then((res) => {
    ctx.body = _splitgoods(res);
  })
  .catch((err) => {
    ctx.status = 500;
    ctx.body = { error: { type: 'APPLICATION_ERROR', message: err.message } }
  });
  ctx.body.goods = body.data[0].attributes.filters.goods;
};

let _fetchData = (request) => {
  return axios(request)
    .then(res => res.data)
    .catch(error => Promise.reject(error));
};

let _splitgoods = (searchResults) => {
  if(searchResults!=null){
    searchResults.data.forEach((_section) =>
    {
      const a = union(_section.attributes.codes.goods_codes_1?_section.attributes.codes.goods_codes_1.split(';'):[],_section.attributes.codes.goods_codes_2?_section.attributes.codes.goods_codes_2.split(';'):[],_section.attributes.codes.goods_codes_3?_section.attributes.codes.goods_codes_3.split(';'):[]);
      _section.attributes.codes.goods = a;
    });
  }
  return searchResults;
};

export default searchService;
