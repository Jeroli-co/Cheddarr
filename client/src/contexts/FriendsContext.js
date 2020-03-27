import React, {createContext, useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext";
import {HttpResponse} from "../models/HttpResponse";
import {createErrorResponse} from "../service/http-service";

const FriendsContext = createContext();

const FriendsContextProvider = (props) => {

  const initialState = {
    friends: [],
    received: [],
    requested: []
  };

  const { apiUrl, handleError } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState(initialState);
  const [addFriendsFeedback, setAddFriendsFeedback] = useState(null);

  const getFriend = async (username) => {
    try {
      const res = await axios.get(apiUrl + "/profile/friends/" + username + "/");
      return new HttpResponse(res.status, res.data.message, res.data);
    } catch (e) {
      handleError(e);
      return(createErrorResponse(e));
    }
  };

  const getFriends = async () => {
    try {
      const res = await axios.get(apiUrl + "/profile/friends/");
      setFriendsList({
        friends: res.data["friends"],
        received: res.data["received"],
        requested: res.data["requested"]
      });
    } catch (e) {
      handleError(e);
    }
  };

  const addFriend = async (username) => {
    const fd = new FormData();
    fd.append('usernameOrEmail', username);
    try {
      const res = await axios.post(apiUrl + "/profile/friends/", fd);
      const requested = friendsList.requested.concat([res.data]);
      setFriendsList({...friendsList, requested: requested});
      setAddFriendsFeedback(new HttpResponse(200, res.data.message));
    } catch (e) {
      handleError(e, [409, 404]);
      setAddFriendsFeedback(createErrorResponse(e));
    }
  };

  const acceptRequest = async (username) => {
    try {
      const res = await axios.get(apiUrl + "/profile/friends/" + username + "/accept/");
      const friends =  friendsList.friends.concat([res.data]);
      const received = friendsList.received.filter(friend => friend.username !== username);
      setFriendsList({...friendsList, received: received, friends: friends})
    } catch (e) {
      handleError(e);
    }

  };

  const deleteFriend = async (username) => {
    try {
      await axios.delete(apiUrl + "/profile/friends/" + username + "/");
      setFriendsList({...friendsList, friends: friendsList.friends.filter(friend => friend.username !== username)});
    } catch (e) {
      handleError(e);
    }
  };

    const refuseFriend = async (username) => {
    try {
      await axios.delete(apiUrl + "/profile/friends/" + username + "/");
      setFriendsList({...friendsList, received: friendsList.friends.filter(friend => friend.username !== username)});
    } catch (e) {
      handleError(e);
    }
  };

    const cancelFriend = async (username) => {
  try {
    await axios.delete(apiUrl + "/profile/friends/" + username + "/");
    setFriendsList({...friendsList, requested: friendsList.friends.filter(friend => friend.username !== username)});
  } catch (e) {
    handleError(e);
  }
};

  return (
    <FriendsContext.Provider value={{
      ...friendsList,
      getFriend,
      getFriends,
      addFriend,
      addFriendsFeedback,
      acceptRequest,
      deleteFriend,
      refuseFriend,
      cancelFriend
    }}>
      { props.children }
    </FriendsContext.Provider>
  );
};

export {
  FriendsContext,
  FriendsContextProvider
}