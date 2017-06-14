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

  await searchService.fetchData(request)
  .then((res) => {
    ctx.body  = searchService.splitgoods(res);
    ctx.body.goods = body.criteria.goods;
  })
  .catch((err) => {
    ctx.body  = err;
  });

  console.log("I am here");
  //ctx.body = { hits:2, goods:body.criteria.goods, files:[{ item_code: 'ML7.c', item_description: 'Chemical warfare (CW) binary precursors and key precursors', goods: ['CAS 16893‑85‑9'], match_phrase: 'Sodium hexafluorosilicate' },{ item_code: '0A987', item_description: 'Optical sighting devices for firearms (including shotguns controlled by 0A984); and parts (See list of items controlled).', goods: ['93052000','9305200090'], match_phrase: 'Armson OEG' }] };
};

 searchService.fetchData = (request) => {
  return axios(request)
    .then(res => res.data)
    .catch(res => Promise.reject(helper.getError(res.data)));
};

searchService.splitgoods = (data) => {
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
  console.log(data);
  return data;
};

export default searchService;
