import React, { useEffect, useState } from "react";
import "./Friends.scss";
import { AddFriendsInput } from "./elements/AddFriendsInput";
import { FriendsList } from "./elements/FriendsList";
import { RequestedList } from "./elements/RequestedList";
import { ReceivedList } from "./elements/ReceivedList";
import { IPublicUser } from "../../../models/IPublicUser";
import {
  FriendService,
  FriendsRequestType,
} from "../../../services/FriendService";

const Friends = () => {
  const [friends, setFriends] = useState<IPublicUser[]>([]);
  const [requested, setRequested] = useState<IPublicUser[]>([]);
  const [received, setReceived] = useState<IPublicUser[]>([]);

  useEffect(() => {
    FriendService.GetFriends().then((response) => {
      if (response.data) setFriends(response.data);
    });

    FriendService.GetFriends(FriendsRequestType.OUTGOING).then((response) => {
      if (response.data) setRequested(response.data);
    });

    FriendService.GetFriends(FriendsRequestType.INCOMING).then((response) => {
      if (response.data) setReceived(response.data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelFriendRequest = async (username: string) => {
    const res = await FriendService.DeleteFriend(username);
    if (res.data) {
      setRequested(requested.filter((user) => user.username !== username));
    }
  };

  const refuseFriendRequest = async (username: string) => {
    const res = await FriendService.DeleteFriend(username);
    if (res.data) {
      setReceived(received.filter((user) => user.username !== username));
    }
  };

  const acceptFriendRequest = async (username: string) => {
    const res = await FriendService.AcceptRequest(username);
    if (res.data) {
      setReceived(received.filter((friend) => friend.username !== username));
      setFriends(friends.concat([res.data]));
    }
  };

  const removeFriend = async (username: string) => {
    const res = await FriendService.DeleteFriend(username);
    if (res.data) {
      setFriends(friends.filter((friend) => friend.username !== username));
    }
  };

  const sendFriendRequest = async (username: string) => {
    const res = await FriendService.AddFriend(username);
    if (res.data) {
      setRequested(requested.concat([res.data]));
    }
    return res;
  };

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
            received={received}
            acceptRequest={acceptFriendRequest}
            refuseRequest={refuseFriendRequest}
          />
          <hr />
          <RequestedList
            requested={requested}
            cancelRequest={cancelFriendRequest}
          />
        </div>
      </div>
    </div>
  );
};

export { Friends };
