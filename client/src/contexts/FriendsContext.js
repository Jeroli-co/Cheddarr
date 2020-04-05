import React, {createContext, useContext, useEffect, useState} from "react";
import {APIContext, methods} from "./APIContext";
import {AuthContext} from "./AuthContext";

const FriendsContext = createContext();

const FriendsContextProvider = (props) => {

  const friendsURI = "/profile/friends/";
  const initialState = {
    friends: [],
    received: [],
    requested: []
  };

  const [friendsLists, setFriendsLists] = useState(initialState);

  const { executeRequest } = useContext(APIContext);
  const { handleError } = useContext(AuthContext);

  useEffect(() => {
    executeRequest(methods.GET, friendsURI).then(res => {
      switch (res.status) {
        case 200:
          setFriendsLists({friends: res.data["friends"], received: res.data["received"], requested: res.data["requested"]});
          return res;
        default:
          handleError(res);
          return null;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFriend = async (username) => {
    const fd = new FormData();
    fd.append('usernameOrEmail', username);
    const res = await executeRequest(methods.POST, friendsURI, fd);
    switch (res.status) {
      case 201:
        const requested = friendsLists.requested.concat([res.data]);
        setFriendsLists({...friendsLists, requested: requested});
        return res;
      case 400:
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const acceptRequest = async (username) => {
    const res = await executeRequest(methods.GET, friendsURI + username + "/accept/");
    switch (res.status) {
      case 200:
        const friends =  friendsLists.friends.concat([res.data]);
        const received = friendsLists.received.filter(friend => friend.username !== username);
        setFriendsLists({...friendsLists, received: received, friends: friends});
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteFriend = async (username) => {
    const res = await executeRequest(methods.DELETE, friendsURI + username + "/");
    switch (res.status) {
      case 200:
        const friends = friendsLists.friends.filter(friend => friend.username !== username);
        setFriendsLists({...friendsLists, friends: friends});
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const refuseFriend = async (username) => {
    const res = await executeRequest(methods.DELETE, friendsURI + username + "/");
    switch (res.status) {
      case 200:
        const received = friendsLists.received.filter(friend => friend.username !== username);
        setFriendsLists({...friendsLists, received: received});
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const cancelFriend = async (username) => {
    const res = await executeRequest(methods.DELETE, friendsURI + username + "/");
    switch (res.status) {
      case 200:
        const requested = friendsLists.requested.filter(friend => friend.username !== username);
        setFriendsLists({...friendsLists, requested: requested});
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getFriendsLength = () => {
    return friendsLists.friends.length;
  };

  const getRequestedLength = () => {
    return friendsLists.requested.length;
  };

  const getReceivedLength = () => {
    return friendsLists.received.length;
  };

  return (
    <FriendsContext.Provider value={{
      ...friendsLists,
      addFriend,
      acceptRequest,
      deleteFriend,
      refuseFriend,
      cancelFriend,
      getFriendsLength,
      getRequestedLength,
      getReceivedLength
    }}>
      { props.children }
    </FriendsContext.Provider>
  );
};

export {
  FriendsContext,
  FriendsContextProvider
}