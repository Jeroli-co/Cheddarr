import React, {useContext, useEffect} from 'react';
import './Friends.scss';
import {FriendsContext} from "../../../contexts/FriendsContext";
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {PendingList} from "./elements/PendingList";
import {RequestList} from "./elements/RequestList";

const Friends = () => {

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
  Friends
}