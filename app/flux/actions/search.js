class SearchActions {

  constructor() {
    this.generateActions(
      'searchSuccess', 'searchFail', 'showCriteria'
    );
  }

  search(data, callback) {
    // You need to return a fn in actions
    // to get alt instance as second parameter to access
    // `alt-resolver` and the ApiClient
    return (dispatch, alt) =>
      // We use `alt-resolver` from the boilerplate
      // to indicate the server we need to resolve
      // this data before server side rendering
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start();
          const response = await alt.request({
            url: '/search',
            method: 'POST',
            data: { criteria: data },
            dataType: 'json'
          });
          this.searchSuccess(response);
          callback(null, response);
        } catch (err) {
          const failureResponse = err.data;
          const applicationError = 'Could not search at this moment, application is down, please try after sometime';
          if (err.data && err.data.error) {
            failureResponse.message = err.data.error.type === 'APPLICATION_ERROR' ? applicationError : 'Unknown error';
          }
          this.searchFail(failureResponse);
          callback(failureResponse);
        }
        alt.getActions('requests').stop();
      });
  }
}

export default SearchActions;
