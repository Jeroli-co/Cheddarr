import React, {createContext, useState} from 'react';
import axios from "axios";
import {createErrorResponse, createResponse} from "../service/http-service";
import {PageLoader} from "../elements/PageLoader";

const methods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch"
};

const APIContext = createContext();

const APIContextProvider = (props) => {

  const apiUrl = "/api";

  const [isLoading, setIsLoading] = useState(false);

  const executeRequest = async (method, url, formData = null, headers = null, withLoader = true) => {
    if (withLoader) {
      setIsLoading(true);
    }
    const reqUrl = apiUrl + url;
    const reqHeaders = headers ? { headers: headers } : {};
    let res = null;
    try {
      switch (method) {
        case methods.GET:
          res = await axios.get(reqUrl, reqHeaders);
          break;
        case methods.POST:
          res = await axios.post(reqUrl, formData, reqHeaders);
          break;
        case methods.PUT:
          res = await axios.put(reqUrl, formData, reqHeaders);
          break;
        case methods.DELETE:
          const deleteHeaders = formData ? { headers: headers, data: formData } : reqHeaders; // Only required for the delete account who is checking the password
          res = await axios.delete(reqUrl, deleteHeaders);
          break;
        case methods.PATCH:
          res = await axios.patch(reqUrl, formData, reqHeaders);
          break;
        default:
          console.log("No methods matched");
          break;
      }
      return createResponse(res);
    } catch (e) {
      return createErrorResponse(e);
    } finally {
      if (withLoader) {
        setIsLoading(false);
      }
    }
  };

  return (
    <APIContext.Provider value={{
      executeRequest,
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </APIContext.Provider>
  );
};

export {
  methods,
  APIContext,
  APIContextProvider
}