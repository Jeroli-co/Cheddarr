import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleRight, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FriendsContext} from "../../../../contexts/FriendsContext";
import {FriendItemContainer} from "./FriendItemContainer";

const ReceivedList = () => {

  const { received, acceptRequest, refuseFriend, getReceivedLength } = useContext(FriendsContext);
  const [showReceivedList, setShowReceivedList] = useState(false);

  const Actions = ({ user }) => {
    return (
      <div className="buttons">
        <button className="button is-success is-small" type="button" onClick={() => acceptRequest(user.username)}>
          <span className="icon">
            <FontAwesomeIcon icon={faCheck}/>
          </span>
        </button>
        <button className="button is-danger is-small" type="button" onClick={() => refuseFriend(user.username)}>
          <span className="icon">
            <FontAwesomeIcon icon={faTimes}/>
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="ReceivedList" data-testid="ReceivedList">

      <div className="level is-pointed" onClick={() => setShowReceivedList(!showReceivedList)}>
        <div className="level-left">
          <div className="level-item">
            <h5 className="subtitle is-5">Received ({getReceivedLength()})</h5>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            { (showReceivedList && <FontAwesomeIcon icon={faAngleDown} size="lg"/>) || (<FontAwesomeIcon icon={faAngleRight} size="lg"/>) }
          </div>
        </div>
      </div>

      { received.map(user =>
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions user={user}/>}
            isShow={showReceivedList}
          />
        )
      }

    </div>
  );
};

export {
  ReceivedList
}