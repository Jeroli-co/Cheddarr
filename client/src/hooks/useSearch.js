import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useApi } from "./useApi";

const useSearch = () => {
  const searchURI = "/search/";
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const search = async (type, value) => {
    switch (type) {
      case "all":
        return await searchMedia(type, value);
      case "friends":
        return await searchFriends(value);
      case "movies":
        return await searchMedia(type, value);
      case "series":
        return await searchMedia(type, value);
      default:
        console.log("No type matched");
        return;
    }
  };

  const searchFriends = async (value) => {
    const res = await executeRequest(
      methods.GET,
      searchURI + "friends/?usernameOrEmail=" + value
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const searchMedia = async (type, value) => {
    const res = await executeRequest(
      methods.GET,
      searchURI + "media/?type=" + type + "&title=" + value
    );
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
  };
};

export { useSearch };
