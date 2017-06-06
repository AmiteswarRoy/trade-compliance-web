class SearchActions {

  constructor() {
    this.generateActions(
      'searchSuccess', 'searchFail'
    );
  }

  search(data, cb) {
    // You need to return a fn in actions
    // to get alt instance as second parameter to access
    // `alt-resolver` and the ApiClient
    console.log('Inside search action');
    return (dispatch, alt) =>
      // We use `alt-resolver` from the boilerplate
      // to indicate the server we need to resolve
      // this data before server side rendering
      alt.resolve(async () => {
        try {
          console.log('Calling search endpoint');
          alt.getActions('requests').start();
          const response = await alt.request({
            url: '/search',
            method: 'POST',
            data: { content: data },
            dataType: 'json'
          });
          console.log(response);
          this.searchSuccess(response);
          cb(response);
        } catch (error) {
          console.log(error);
          this.searchFail({ error });
          cb(error);
        }
        alt.getActions('requests').stop();
      });
  }
}

export default SearchActions;
