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

  const getFriends = async () => {
    try {
      const res = await axios.get(apiUrl + "/profile/friends/");
      console.log(res);
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
      setFriendsList({...friendsList, requested: friendsList.requested.push(res.data.user)});
      setAddFriendsFeedback(new HttpResponse(200, res.data.message));
    } catch (e) {
      handleError(e, [409, 404]);
      setAddFriendsFeedback(createErrorResponse(e));
    }
  };

  const acceptRequest = async (username) => {

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
      addFriendsFeedback,
      acceptRequest,
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