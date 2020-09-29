import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleRight, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FriendItemContainer} from "./FriendItemContainer";

const RequestedList = ({ requested, cancelRequest }) => {

  const [showRequestedList, setShowRequestedList] = useState(false);

  const Actions = ({ user }) => {
    return (
      <button className="button is-danger is-small" type="button" onClick={() => cancelRequest(user.username)}>
        <span className="icon">
          <FontAwesomeIcon icon={faMinus}/>
        </span>
      </button>
    );
  };

  return (
    <div className="RequestedList" data-testid="RequestedList">

      <div className="level is-pointed" onClick={() => setShowRequestedList(!showRequestedList)}>
        <div className="level-left">
          <div className="level-item">
            <h5 className="subtitle is-5">Requested ({requested.length})</h5>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            { (showRequestedList && <FontAwesomeIcon icon={faAngleDown} size="lg"/>) || (<FontAwesomeIcon icon={faAngleRight} size="lg"/>) }
          </div>
        </div>
      </div>

      { requested.map(user =>
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions user={user}/>}
            isShow={showRequestedList}
          />
        )
      }

    </div>
  )
};

export {
  RequestedList
}