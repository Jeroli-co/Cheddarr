class HttpServiceResponseModel {
  constructor(data, status, error) {
    this.data = data;
    this.status = status;
    this.error = error;
  }
}

export { HttpServiceResponseModel };
