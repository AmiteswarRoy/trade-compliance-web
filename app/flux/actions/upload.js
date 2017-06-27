class UploadActions {

  constructor() {
    this.generateActions(
      'uploadSuccess', 'uploadFail'
    );
  }

  uploadFile(data, callback) {
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
            url: '/upload',
            method: 'POST',
            data: { content: data },
            dataType: 'json',
            contentType: 'multipart/form-data'
          });
          this.uploadSuccess(response);
          callback(null, response);
        } catch (err) {
          const invalidFile = 'The template could not load the dual goods. Please confirm all the names have required information and try again.';
          const applicationError = 'Could not upload the file, application is down, please try after sometime';
          const failureResponse = err.data;
          if (err.data && err.data.error) {
            failureResponse.message = err.data.error.type === 'INVALID_REQUEST' ? invalidFile : applicationError;
          }
          this.uploadFail({ failureResponse });
          callback(failureResponse);
        }
        alt.getActions('requests').stop();
      });
  }
}

export default UploadActions;
