import {useApi} from "./useApi";
import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";

const usePlex = () => {

  const providerUrl = "/provider/plex/";
  const moviesUrl = providerUrl + "movies/"

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const getMoviesRecentlyAdded = async () => {
    const res = await executeRequest(methods.GET, moviesUrl + "recent");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getMoviesRecentlyAdded
  }

};

export {
  usePlex
}
