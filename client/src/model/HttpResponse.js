class HttpResponse {
  constructor (status, message, error = false) {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export {
  HttpResponse
}