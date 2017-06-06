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

}

export default SearchStore;
