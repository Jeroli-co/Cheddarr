import {HttpResponse} from "../models/HttpResponse";

const createResponse = (res) => {
  return new HttpResponse(res.status, res.data.message, res.data, res.headers);
};

const isHttpError = (error) => {
  return error.hasOwnProperty('response');
};

const createErrorResponse = (e) => {
  return isHttpError(e) ?
    new HttpResponse(e.response.status, e.response.data.message, null, e.response.headers) :
    new HttpResponse(500, "", null, e.response.headers)
};

export {
  isHttpError,
  createResponse,
  createErrorResponse,
}