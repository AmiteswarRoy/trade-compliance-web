let searchService = {};

searchService.search = (ctx) => {
  console.log('In search entry: ');
  const body = ctx.request.body;
  console.log(body);
  ctx.body = { hits:2, goods:body.criteria.goods, files:[{ item_code: 'item_code_1', item_description: 'item_description_1', goods: ['goods_1','goods_2','goods_3'], match_phrase: 'match_phrase_1' },{ item_code: 'item_code_2', item_description: 'item_description_2', goods: ['goods_1','goods_2','goods_3','goods_4'], match_phrase: 'match_phrase_1' }] };
};

export default searchService;
