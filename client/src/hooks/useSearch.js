import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useApi } from "./useApi";

const useSearch = () => {
  const searchURI = "/search/";
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const search = async (type, value) => {
    const url =
      searchURI +
      "?" +
      (type !== "all" ? "type=" + type + "&" : "") +
      "value=" +
      value;
    const res = await executeRequest(methods.GET, url);
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const searchOnline = async (type, value) => {
    const url = searchURI + type + "/?value=" + value;
    const res = await executeRequest(methods.GET, url);
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    search,
    searchOnline,
  };
};

export { useSearch };
