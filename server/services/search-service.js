let searchService = {};

searchService.search = (ctx) => {
  console.log('In search entry: ');
  const body = ctx.request.body;
  console.log(body);
  ctx.body = [{ item_code: 'item_code_1', item_description: 'item_description_1', goods: 'goods_1', match_phrase: 'match_phrase_1' },{ item_code: 'item_code_2', item_description: 'item_description_2', goods: 'goods_2', match_phrase: 'match_phrase_1' }];
};

export default searchService;
