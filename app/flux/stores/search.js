class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));

    this.collection = { goods: [], files: [] };
    this.isSearchTriggered = false;
    this.error = null;
  }

  onSearchSuccess(response: Object) {
    this.collection = response;
    this.error = null;
    this.isSearchTriggered = true;
  }

  onSearchFail(response: Object) {
    this.collection = response;
    this.error = null;
    this.isSearchTriggered = true;
  }

  onShowCriteria() {
    this.isSearchTriggered = false;
  }

}

export default SearchStore;
