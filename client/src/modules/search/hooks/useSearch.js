import { useContext } from "react";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";

const useSearch = () => {
  const searchURI = "/search/";
  const { handleError } = useContext(AuthContext);

  const search = async (type, value) => {
    const url =
      searchURI +
      "?" +
      (type !== "all" ? "type=" + type + "&" : "") +
      "value=" +
      value;
    const res = await HttpService.executeRequest(HTTP_METHODS.GET, url);
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
    const res = await HttpService.executeRequest(HTTP_METHODS.GET, url);
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
