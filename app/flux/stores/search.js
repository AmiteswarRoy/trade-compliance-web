class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));

    this.collection = [];
    this.isSearchTriggered = false;
    this.error = null;
  }

  onSearchSuccess(response: Array) {
    console.log('In search success');
    console.log('response');
    console.log(response);
    this.collection = response;
    this.error = null;
    this.isSearchTriggered = true;
  }

  onSearchFail({ error }: { error: ?Object }) {
    this.collection = [];
    this.error = error;
  }

}

export default SearchStore;
