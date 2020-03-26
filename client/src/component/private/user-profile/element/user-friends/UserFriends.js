import React, {useContext, useEffect} from 'react';
import './UserFriends.scss';
import {FriendsContext} from "../../../../../context/FriendsContext";
import {AddFriendsInput} from "./element/AddFriendsInput";
import {FriendsList} from "./element/FriendsList";
import {PendingList} from "./element/PendingList";
import {RequestList} from "./element/RequestList";

const UserFriends = () => {

  const { getFriends } = useContext(FriendsContext);

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="UserFriendsList" data-testid="UserFriendsList">
      <div className="container">
        <AddFriendsInput/>
        <hr/>
        <h1 className="subtitle is-3">Request</h1>
        <hr/>
        <RequestList/>
        <h1 className="subtitle is-3">Pending</h1>
        <hr/>
        <PendingList/>
        <h1 className="subtitle is-3">Current</h1>
        <hr/>
        <FriendsList/>
      </div>
    </div>
  )
};

export {
  UserFriends
}