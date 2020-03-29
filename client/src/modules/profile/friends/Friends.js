import React, {useContext, useState} from 'react';
import './Friends.scss';
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";
import {FriendsContext} from "../../../contexts/FriendsContext";
import {Fade} from "react-reveal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleRight} from "@fortawesome/free-solid-svg-icons";

const Friends = () => {

  const { getFriendsLength, getRequestedLength, getReceivedLength } = useContext(FriendsContext);

  const [isFriendVisible, setIsFriendVisible] = useState(true);
  const [isReceivedVisible, setIsReceivedVisible] = useState(false);
  const [isRequestedVisible, setIsRequestedVisible] = useState(false);

  const toggleFriend = () => {
    setIsFriendVisible(!isFriendVisible);
  };

  const toggleReceived = () => {
    setIsReceivedVisible(!isReceivedVisible);
  };

  const toggleRequested = () => {
    setIsRequestedVisible(!isRequestedVisible);
  };

  return (
    <div className="Friends" data-testid="Friends">
      <AddFriendsInput/>
      <hr/>
      <div className="tile is-ancestor">

        <div className="tile is-6 is-parent">
          <div className="tile is-child">

            <div className="level is-pointed" onClick={toggleFriend}>
              <div className="level-left">
                <div className="level-item">
                  <h5 className="subtitle is-5">Friends ({getFriendsLength()})</h5>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  { isFriendVisible && <FontAwesomeIcon icon={faAngleDown} size="lg"/> || <FontAwesomeIcon icon={faAngleRight} size="lg"/> }
                </div>
              </div>
            </div>

            <hr/>

            <Fade top collapse when={isFriendVisible}>
              <FriendsList/>
            </Fade>

          </div>
        </div>

        <div className="tile is-vertical is-parent">
          <div className="tile is-child">

            <div className="level is-pointed" onClick={toggleReceived}>
              <div className="level-left">
                <div className="level-item">
                  <h5 className="subtitle is-5">Received ({getReceivedLength()})</h5>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  { isReceivedVisible && <FontAwesomeIcon icon={faAngleDown} size="lg"/> || <FontAwesomeIcon icon={faAngleRight} size="lg"/> }
                </div>
              </div>
            </div>

            <hr/>

            <Fade top collapse when={isReceivedVisible}>
              <ReceivedList/>
            </Fade>

          </div>

          <div className="tile is-child">

            <div className="level is-pointed" onClick={toggleRequested}>
              <div className="level-left">
                <div className="level-item">
                  <h5 className="subtitle is-5">Requested ({getRequestedLength()})</h5>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  { isRequestedVisible && <FontAwesomeIcon icon={faAngleDown} size="lg"/> || <FontAwesomeIcon icon={faAngleRight} size="lg"/> }
                </div>
              </div>
            </div>

            <hr/>

            <Fade top collapse when={isRequestedVisible}>
              <RequestedList/>
            </Fade>

          </div>

        </div>

      </div>
    </div>
  )
};

export {
  Friends
}