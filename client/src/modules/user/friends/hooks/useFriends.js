import { useContext } from "react";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { useApi } from "../../../api/hooks/useApi";

const useFriends = () => {
  const friendsURI = "/user/friends/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const getFriends = async () => {
    const res = await executeRequest(methods.GET, friendsURI);
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getReceived = async () => {
    const res = await executeRequest(methods.GET, friendsURI + "received/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getRequested = async () => {
    const res = await executeRequest(methods.GET, friendsURI + "requested/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const addFriend = async (username) => {
    const fd = new FormData();
    fd.append("usernameOrEmail", username);
    const res = await executeRequest(methods.POST, friendsURI, fd);
    switch (res.status) {
      case 200:
      case 400:
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const acceptRequest = async (username) => {
    const res = await executeRequest(
      methods.PATCH,
      friendsURI + username + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteFriend = async (username) => {
    const res = await executeRequest(
      methods.DELETE,
      friendsURI + username + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const refuseFriend = async (username) => {
    const res = await executeRequest(
      methods.DELETE,
      friendsURI + username + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const cancelFriend = async (username) => {
    const res = await executeRequest(
      methods.DELETE,
      friendsURI + username + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getMediaStatus = async (provider, media_id) => {
    const res = await executeRequest(
      methods.GET,
      friendsURI +
        "/media/status/?provider=" +
        provider.username +
        "&media=" +
        media_id
    );
    switch (res.status) {
      case 200:
        return res.data.hasOwnProperty("status") ? res.data.status : null;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    addFriend,
    acceptRequest,
    deleteFriend,
    refuseFriend,
    cancelFriend,
    getFriends,
    getReceived,
    getRequested,
    getMediaStatus,
  };
};

export { useFriends };
