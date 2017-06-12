let searchService = {};

searchService.search = (ctx) => {
  console.log('In search entry: ');
  const body = ctx.request.body;
  console.log(body);
  ctx.body = { hits:2, goods:body.criteria.goods, files:[{ item_code: 'ML7.c', item_description: 'Chemical warfare (CW) binary precursors and key precursors', goods: ['CAS 16893‑85‑9'], match_phrase: 'Sodium hexafluorosilicate' },{ item_code: '0A987', item_description: 'Optical sighting devices for firearms (including shotguns controlled by 0A984); and parts (See list of items controlled).', goods: ['93052000','9305200090'], match_phrase: 'Armson OEG' }] };
};

export default searchService;
