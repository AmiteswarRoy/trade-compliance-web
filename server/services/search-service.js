import axios from 'axios';
import settingsProvider from 'utils/settings-provider';
import helper from 'sources/utils/api/v3/helper';

let searchService = {};

searchService.search = async (ctx) => {
  console.log('In search entry: ');
  const body = ctx.request.body
  console.log(body);
  const baseUrl = settingsProvider.get('TRADES_COMPLIANCE.API_SEARCH_URL');
  const request = {
    url: `${baseUrl}`,
    method: 'post',
    timeout: settingsProvider.get('GENERAL.TIME_OUT'),
    data:  body
  };

  await _fetchData(request)
  .then((res) => {
    ctx.body  = _splitgoods(res);
  })
  .catch((err) => {
    ctx.body  = err;
  });
  ctx.body.goods = body.criteria.goods;
};

let _fetchData = (request) => {
  return axios(request)
    .then(res => res.data)
    .catch(res => Promise.reject({ message: res.data.message }));
};

let _splitgoods = (data) => {
  if(data!=null){
    data.files.forEach((_section) =>
    {
      if(_section.goods!=null){
        _section.goods = _section.goods.split(';')
      }else{
        _section.goods = [];
      }
    });
  }
  return data;
};

export default searchService;
