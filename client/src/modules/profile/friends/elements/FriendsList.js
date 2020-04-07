import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleRight, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FriendItemContainer} from "./FriendItemContainer";

const FriendsList = ({ friends, removeFriend }) => {

  const [showFriendsList, setShowFriendsList] = useState(true);

  const Actions = ({ user }) => {
    return (
      <button className="button is-danger is-small" type="button" onClick={() => removeFriend(user.username)}>
        <span className="icon">
          <FontAwesomeIcon icon={faMinus}/>
        </span>
      </button>
    );
  };

  return (
    <div className="FriendsList" data-testid="FriendsList">

      <div className="level is-pointed" onClick={() => setShowFriendsList(!showFriendsList)}>
        <div className="level-left">
          <div className="level-item">
            <h5 className="subtitle is-5">Friends ({friends.length})</h5>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            { (showFriendsList && <FontAwesomeIcon icon={faAngleDown} size="lg"/>) || (<FontAwesomeIcon icon={faAngleRight} size="lg"/>) }
          </div>
        </div>
      </div>

      { friends.map(user =>
          <FriendItemContainer
            user={user}
            actions={<Actions user={user}/>}
            isShow={showFriendsList}
          />
        )
      }

    </div>
  );
};

export {
  FriendsList
}