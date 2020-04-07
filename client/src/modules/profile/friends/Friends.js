import React from 'react';
import './Friends.scss';
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";

const Friends = () => {

  return (
    <div className="Friends" data-testid="Friends">

      <AddFriendsInput/>

      <hr/>

      <div className="columns">
        <div className="column is-half">
          <FriendsList/>
        </div>
        <div className="column">
          <ReceivedList/>
          <hr/>
          <RequestedList/>
        </div>
      </div>

    </div>
  )
};

export {
  Friends
}