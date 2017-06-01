class UploadStore {

  constructor() {
    this.bindActions(this.alt.getActions('upload'));

    this.collection = [];
    this.error = null;
  }

  onUploadSuccess({ response }: { response: ?Object }) {
    this.collection = response;
  }

  onUploadFail({ error }: { error: ?Object }) {
    this.error = error;
  }

}

export default UploadStore;
