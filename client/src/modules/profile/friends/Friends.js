import React, {useContext, useEffect} from 'react';
import './Friends.scss';
import {FriendsContext} from "../../../contexts/FriendsContext";
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";

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
        <h1 className="subtitle is-4">Requested</h1>
        <hr/>
        <RequestedList/>
        <h1 className="subtitle is-4">Received</h1>
        <hr/>
        <ReceivedList/>
        <h1 className="subtitle is-4">Friends</h1>
        <hr/>
        <FriendsList/>
      </div>
    </div>
  )
};

export {
  Friends
}