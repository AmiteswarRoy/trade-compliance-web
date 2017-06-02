class UploadActions {

  constructor() {
    this.generateActions(
      'uploadSuccess', 'uploadFail'
    );
  }

  uploadFile(data, cb) {
    // You need to return a fn in actions
    // to get alt instance as second parameter to access
    // `alt-resolver` and the ApiClient
    console.log(data.filename);
    console.log(data.filetype);
    return (dispatch, alt) =>
      // We use `alt-resolver` from the boilerplate
      // to indicate the server we need to resolve
      // this data before server side rendering
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start();
          const response = await alt.request({
            url: '/upload',
            method: 'POST',
            data: { content: data },
            dataType: 'json',
            contentType: 'multipart/form-data'
          });
          console.log(response);
          this.uploadSuccess(response);
          cb(response);
        } catch (error) {
          console.log(error);
          this.uploadFail({ error });
          cb(error);
        }
        alt.getActions('requests').stop();
      });
  }
}

export default UploadActions;
