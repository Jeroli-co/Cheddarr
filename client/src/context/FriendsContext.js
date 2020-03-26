import React, {createContext, useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext";
import {HttpResponse} from "../model/HttpResponse";
import {createErrorResponse} from "../service/http-service";

const FriendsContext = createContext();

const FriendsContextProvider = (props) => {

  const initialState = {
    friends: [],
    requests: [],
    pendings: []
  };

  const { apiUrl, handleError } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState(initialState);
  const [addFriendsFeedback, setAddFriendsFeedback] = useState(null);

  const getFriends = async () => {
    try {
      const res = await axios.get(apiUrl + "/profile/friends/");
      setFriendsList({
        friends: res.data["friends"],
        requests: res.data["received"],
        pendings: res.data["pending"]
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
      setFriendsList({...friendsList, pendings: friendsList.pendings.push(res.data.user)});
      setAddFriendsFeedback(new HttpResponse(200, res.data.message));
    } catch (e) {
      handleError(e, [409, 404]);
      setAddFriendsFeedback(createErrorResponse(e));
    }
  };

  const cancelRequest = async (username) => {

  };

  const acceptRequest = async (username) => {

  };

  const refuseRequest = async (username) => {

  };

  const deleteFriend = async (username) => {
    try {
      await axios.delete(apiUrl + "/profile/friends/" + username + "/");
      setFriendsList({...friendsList, friends: friendsList.friends.filter(friend => friend.username !== username)});
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <FriendsContext.Provider value={{
      ...friendsList,
      getFriends,
      addFriend,
      cancelRequest,
      addFriendsFeedback,
      acceptRequest,
      refuseRequest,
      deleteFriend
    }}>
      { props.children }
    </FriendsContext.Provider>
  );
};

export {
  FriendsContext,
  FriendsContextProvider
}