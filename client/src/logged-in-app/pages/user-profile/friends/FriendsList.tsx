import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FriendItemContainer } from "./FriendItemContainer";
import { IPublicUser } from "../../../models/IPublicUser";
import { IAsyncCall } from "../../../../shared/models/IAsyncCall";
import Spinner from "../../../../shared/components/Spinner";

type FriendsListProps = {
  friends: IAsyncCall<IPublicUser[] | null>;
  removeFriend: (friend: IPublicUser) => void;
};

const FriendsList = ({ friends, removeFriend }: FriendsListProps) => {
  const [showFriendsList, setShowFriendsList] = useState(true);

  const Actions = (friend: IPublicUser) => {
    return (
      <button
        className="button is-danger is-small"
        type="button"
        onClick={() => removeFriend(friend)}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faMinus} />
        </span>
      </button>
    );
  };

  return (
    <div className="FriendsList" data-testid="FriendsList">
      <div
        className="level is-pointed"
        onClick={() => setShowFriendsList(!showFriendsList)}
      >
        <div className="level-left">
          <div className="level-item">
            Friends ({friends.data ? friends.data.length : 0})
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {(showFriendsList && (
              <FontAwesomeIcon icon={faAngleDown} size="lg" />
            )) || <FontAwesomeIcon icon={faAngleRight} size="lg" />}
          </div>
        </div>
      </div>

      {friends.isLoading && <Spinner />}
      {!friends.isLoading &&
        friends.data &&
        friends.data.map((user: IPublicUser) => (
          <FriendItemContainer
            key={user.username}
            user={user}
            actions={<Actions {...user} />}
            isShow={showFriendsList}
          />
        ))}
    </div>
  );
};

export { FriendsList };
