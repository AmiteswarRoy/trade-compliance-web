import searchService from './../services/search-service';
import uploadService from './../services/upload-service';

function routes(router) {

  router.post('/upload', uploadService.upload);
  router.post('/search', searchService.search);

}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes;
