class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));

    this.collection = { goods: [], files: [] };
    this.isSearchTriggered = false;
    this.error = null;
  }

  onSearchSuccess(response: Object) {
    console.log('In search success');
    console.log('response');
    console.log(response);
    this.collection = response;
    this.error = null;
    this.isSearchTriggered = true;
  }

  onSearchFail({ error }: { error: ?Object }) {
    this.collection = { goods: [], files: [] };
    this.error = error;
  }

  onShowCriteria() {
    this.isSearchTriggered = false;
  }

}

export default SearchStore;
