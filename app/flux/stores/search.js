class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));

    this.collection = [];
    this.error = null;
  }

  onSearchSuccess({ response }: { response: ?Object }) {
    this.collection = response;
    this.error = null;
  }

  onSearchFail({ error }: { error: ?Object }) {
    this.collection = [];
    this.error = error;
  }

  search(data) {
    console.log('in search action');
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
            data: { content: data },
            dataType: 'json'
          });
          console.log(response);
          this.searchSuccess(response);
        } catch (error) {
          console.log(error);
          this.searchFail({ error });
        }
        alt.getActions('requests').stop();
      });
  }

}

export default SearchStore;
