import { useContext, useEffect, useState } from "react";
import {
  AsyncCallDefault,
  errorAsyncCall,
  IAsyncCall,
  successAsyncCall,
} from "../models/IAsyncCall";
import { IPublicUser } from "../models/IPublicUser";
import { FriendService, FriendsRequestType } from "../services/FriendService";
import { NotificationContext } from "../contexts/notifications/NotificationContext";

export const useFriends = () => {
  const [friends, setFriends] = useState<IAsyncCall<IPublicUser[]>>(
    AsyncCallDefault
  );

  const [friendsRequestReceived, setFriendsRequestReceived] = useState<
    IAsyncCall<IPublicUser[]>
  >(AsyncCallDefault);

  const [friendsRequestSent, setFriendsRequestSent] = useState<
    IAsyncCall<IPublicUser[]>
  >(AsyncCallDefault);

  const { pushInfo, pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    FriendService.GetFriends().then(
      (res) => {
        setFriends(successAsyncCall(res.data));
      },
      (error) => {
        setFriends(errorAsyncCall(error.response.status));
      }
    );
  }, []);

  useEffect(() => {
    FriendService.GetFriends(FriendsRequestType.INCOMING).then(
      (res) => {
        setFriendsRequestReceived(successAsyncCall(res.data));
      },
      (error) => {
        setFriendsRequestReceived(errorAsyncCall(error.response.status));
      }
    );
  }, []);

  useEffect(() => {
    FriendService.GetFriends(FriendsRequestType.OUTGOING).then(
      (res) => {
        setFriendsRequestSent(successAsyncCall(res.data));
      },
      (error) => {
        setFriendsRequestSent(errorAsyncCall(error.response.status));
      }
    );
  }, []);

  const addFriend = (friend: IPublicUser) => {
    if (friends.data) {
      const data = friends.data;
      data.push(friend);
      setFriends({ ...friends, data: data });
    }
  };

  const removeFriend = (friend: IPublicUser) => {
    FriendService.DeleteFriend(friend.username).then(
      (res) => {
        if (friends.data && res.data) {
          let data = friends.data;
          data = data.filter((f) => f.username !== friend.username);
          setFriends({ ...friends, data: data });
        }
      },
      (_) => {
        pushDanger("Cannot delete friendship, try again later.");
      }
    );
  };

  const acceptFriendRequest = (friend: IPublicUser) => {
    FriendService.AcceptRequest(friend.username).then(
      (res) => {
        if (res.data && friendsRequestReceived.data) {
          let data = friendsRequestReceived.data;
          data = data.filter((f) => f.username !== friend.username);
          setFriendsRequestReceived({ ...friendsRequestReceived, data: data });
          addFriend(friend);
        }
      },
      (_) => {
        pushDanger("Cannot accept friend request");
      }
    );
  };

  const refuseFriendRequest = (friend: IPublicUser) => {
    FriendService.DeleteFriend(friend.username).then(
      (res) => {
        if (res.data && friendsRequestReceived.data) {
          let data = friendsRequestReceived.data;
          data = data.filter((f) => f.username !== friend.username);
          setFriendsRequestReceived({ ...friendsRequestReceived, data: data });
          pushInfo("Friends request refused");
        }
      },
      (_) => {
        pushDanger("Cannot refuse request, try again later");
      }
    );
  };

  const sendFriendRequest = (username: string) => {
    FriendService.AddFriend(username).then(
      (res) => {
        if (res.data && friendsRequestSent.data) {
          let data = friendsRequestSent.data;
          data.push(res.data);
          setFriendsRequestSent({ ...friendsRequestSent, data: data });
          pushInfo("Friend request sent");
        }
      },
      (_) => {
        pushDanger("Cannot send friend request, try again later.");
      }
    );
  };

  const cancelFriendRequest = (friend: IPublicUser) => {
    FriendService.DeleteFriend(friend.username).then(
      (res) => {
        if (res.data && friendsRequestSent.data) {
          let data = friendsRequestSent.data;
          data = data.filter((f) => f.username !== friend.username);
          setFriendsRequestSent({ ...friendsRequestSent, data: data });
        }
      },
      (_) => {
        pushDanger("Cannot cancel friend request, try again later.");
      }
    );
  };

  return {
    friends,
    friendsRequestSent,
    friendsRequestReceived,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    refuseFriendRequest,
    sendFriendRequest,
    cancelFriendRequest,
  };
};
