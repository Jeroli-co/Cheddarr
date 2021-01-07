import React from "react";
import { AddFriendsInput } from "./AddFriendsInput";
import { FriendsList } from "./FriendsList";
import { RequestedList } from "./RequestedList";
import { ReceivedList } from "./ReceivedList";
import { useFriends } from "../../../hooks/useFriends";

const Friends = () => {
  const {
    friends,
    friendsRequestReceived,
    friendsRequestSent,
    removeFriend,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    refuseFriendRequest,
  } = useFriends();

  return (
    <div className="Friends" data-testid="Friends">
      <AddFriendsInput sendFriendRequest={sendFriendRequest} />

      <hr />

      <div className="columns">
        <div className="column is-half">
          <FriendsList friends={friends} removeFriend={removeFriend} />
        </div>
        <div className="column">
          <ReceivedList
            received={friendsRequestReceived}
            acceptRequest={acceptFriendRequest}
            refuseRequest={refuseFriendRequest}
          />
          <hr />
          <RequestedList
            requested={friendsRequestSent}
            cancelRequest={cancelFriendRequest}
          />
        </div>
      </div>
    </div>
  );
};

export { Friends };
