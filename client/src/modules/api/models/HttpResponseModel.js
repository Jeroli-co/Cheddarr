class HttpResponseModel {
  constructor (status, message, data = null, headers = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.headers = headers;
  }
}

export {
  HttpResponseModel
}