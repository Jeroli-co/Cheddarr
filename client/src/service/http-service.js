import {HttpResponseModel} from "../models/HttpResponseModel";

const createResponse = (res) => {
  return new HttpResponseModel(res.status, res.data.message, res.data, res.headers);
};

const isHttpError = (error) => {
  return error.hasOwnProperty("response") && error.response !== null;
};

const createErrorResponse = (e) => {
  return isHttpError(e) ?
    new HttpResponseModel(e.response.status, e.response.data.message, null, e.response.headers) :
    new HttpResponseModel(500, "", null, e.response.headers)
};

export {
  isHttpError,
  createResponse,
  createErrorResponse,
}
