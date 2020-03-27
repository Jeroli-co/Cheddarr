import {HttpResponse} from "../models/HttpResponse";

const isHttpError = (error) => {
  return error.hasOwnProperty('response');
};

const createErrorResponse = (e) => {
  return isHttpError(e) ?
    new HttpResponse(e.response.status, e.response.data.message) :
    new HttpResponse(500, "")
};

export {
  createErrorResponse
}