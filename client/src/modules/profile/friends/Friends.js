import React from 'react';
import './Friends.scss';
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";

const Friends = () => {
  return (
    <div className="Friends" data-testid="Friends">
      <div className="container">
        <AddFriendsInput/>
        <hr/>
        <h5 className="subtitle is-5">Requested</h5>
        <hr/>
        <RequestedList/>
        <h5 className="subtitle is-5">Received</h5>
        <hr/>
        <ReceivedList/>
        <h5 className="subtitle is-5">Friends</h5>
        <hr/>
        <FriendsList/>
      </div>
    </div>
  )
};

export {
  Friends
}