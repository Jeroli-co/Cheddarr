import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FriendItemContainer } from "./FriendItemContainer";
import { IPublicUser } from "../../../models/IPublicUser";
import { IAsyncCall } from "../../../../shared/models/IAsyncCall";
import Spinner from "../../../../shared/components/Spinner";

type FriendsReceivedListProps = {
  received: IAsyncCall<IPublicUser[] | null>;
  acceptRequest: (friend: IPublicUser) => void;
  refuseRequest: (friend: IPublicUser) => void;
};

const ReceivedList = ({
  received,
  acceptRequest,
  refuseRequest,
}: FriendsReceivedListProps) => {
  const [showReceivedList, setShowReceivedList] = useState(false);

  const Actions = (friend: IPublicUser) => {
    return (
      <div className="buttons">
        <button
          className="button is-success is-small"
          type="button"
          onClick={() => acceptRequest(friend)}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        </button>
        <button
          className="button is-danger is-small"
          type="button"
          onClick={() => refuseRequest(friend)}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="ReceivedList" data-testid="ReceivedList">
      <div
        className="level is-pointed"
        onClick={() => setShowReceivedList(!showReceivedList)}
      >
        <div className="level-left">
          <div className="level-item">
            <h5 className="subtitle is-5">
              Received ({received.data ? received.data.length : 0})
            </h5>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {(showReceivedList && (
              <FontAwesomeIcon icon={faAngleDown} size="lg" />
            )) || <FontAwesomeIcon icon={faAngleRight} size="lg" />}
          </div>
        </div>
      </div>

      {showReceivedList && received.isLoading && <Spinner />}
      {!received.isLoading &&
        received.data &&
        received.data.map((user) => (
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions {...user} />}
            isShow={showReceivedList}
          />
        ))}
    </div>
  );
};

export { ReceivedList };
