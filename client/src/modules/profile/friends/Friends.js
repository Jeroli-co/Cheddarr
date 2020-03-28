import React, {useContext} from 'react';
import './Friends.scss';
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";
import {FriendsContext} from "../../../contexts/FriendsContext";

const Friends = () => {

  const { getFriendsLength, getRequestedLength, getReceivedLength } = useContext(FriendsContext);

  return (
    <div className="Friends" data-testid="Friends">
      <div className="container">
        <AddFriendsInput/>
        <hr/>
        <div className="tile is-ancestor">
          <div className="tile is-6 is-parent">
            <div className="tile is-child">
              <h5 className="subtitle is-5">Friends ({getFriendsLength()})</h5>
              <hr/>
              <FriendsList/>
            </div>
          </div>
          <div className="tile is-vertical is-parent">
            <div className="tile is-child">
              <h5 className="subtitle is-5">Requested ({getRequestedLength()})</h5>
              <hr/>
              <RequestedList/>
            </div>
            <div className="tile is-child">
              <h5 className="subtitle is-5">Received ({getReceivedLength()})</h5>
              <hr/>
              <ReceivedList/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export {
  Friends
}