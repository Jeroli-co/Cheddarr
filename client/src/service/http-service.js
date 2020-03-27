import {HttpResponse} from "../models/HttpResponse";

const createResponse = (res) => {
  return new HttpResponse(res.status, res.data.message, res.data);
};

const isHttpError = (error) => {
  return error.hasOwnProperty('response');
};

const createErrorResponse = (e) => {
  return isHttpError(e) ?
    new HttpResponse(e.response.status, e.response.data.message) :
    new HttpResponse(500, "")
};

const isHandlingCode = (res, codes) => {
  return codes.includes(res.status);
};

export {
  isHttpError,
  createResponse,
  createErrorResponse,
  isHandlingCode
}