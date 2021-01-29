import { useContext, useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { IPublicUser } from "../models/IPublicUser";
import { AlertContext } from "../../shared/contexts/AlertContext";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

export const useFriends = () => {
  const [friends, setFriends] = useState<IAsyncCall<IPublicUser[] | null>>(
    DefaultAsyncCall
  );

  const [friendsRequestReceived, setFriendsRequestReceived] = useState<
    IAsyncCall<IPublicUser[] | null>
  >(DefaultAsyncCall);

  const [friendsRequestSent, setFriendsRequestSent] = useState<
    IAsyncCall<IPublicUser[] | null>
  >(DefaultAsyncCall);

  const { get, remove, patch, post } = useAPI();

  const { pushSuccess, pushInfo, pushDanger } = useContext(AlertContext);

  useEffect(() => {
    async function getAllFriendsRequests() {
      const [
        friendsRequests,
        incomingFriendsRequests,
        outgoingFriendsRequests,
      ] = await Promise.all([
        get<IPublicUser[]>(APIRoutes.GET_FRIENDS),
        get<IPublicUser[]>(APIRoutes.GET_INCOMING_FRIEND_REQUESTS),
        get<IPublicUser[]>(APIRoutes.GET_OUTGOING_FRIEND_REQUESTS),
      ]);

      setFriends(friendsRequests);
      setFriendsRequestReceived(incomingFriendsRequests);
      setFriendsRequestSent(outgoingFriendsRequests);
    }

    getAllFriendsRequests().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFriend = (friend: IPublicUser) => {
    if (friends.data) {
      const data = friends.data;
      data.push(friend);
      setFriends({ ...friends, data: data });
    }
  };

  const removeFriend = (friend: IPublicUser) => {
    remove(APIRoutes.DELETE_FRIEND(friend.username)).then((res) => {
      if (res.status === 200 && friends.data) {
        let data = friends.data;
        data = data.filter((f) => f.username !== friend.username);
        setFriends({ ...friends, data: data });
        pushInfo(friend.username + " has been remove from friends list");
      } else {
        pushDanger("Cannot delete friend");
      }
    });
  };

  const acceptFriendRequest = (friend: IPublicUser) => {
    patch<IPublicUser>(APIRoutes.ACCEPT_FRIEND_REQUEST(friend.username)).then(
      (res) => {
        if (res.status === 200 && friendsRequestReceived.data) {
          let data = friendsRequestReceived.data;
          data = data.filter((f) => f.username !== friend.username);
          setFriendsRequestReceived({ ...friendsRequestReceived, data: data });
          addFriend(friend);
          pushSuccess("Friend request accepted");
        } else {
          pushDanger("Cannot accept friend request");
        }
      }
    );
  };

  const refuseFriendRequest = (friend: IPublicUser) => {
    remove(APIRoutes.DELETE_FRIEND(friend.username)).then((res) => {
      if (res.status === 200 && friendsRequestReceived.data) {
        let data = friendsRequestReceived.data;
        data = data.filter((f) => f.username !== friend.username);
        setFriendsRequestReceived({ ...friendsRequestReceived, data: data });
        pushInfo("Friends request refused");
      } else {
        pushDanger("Cannot refuse request, try again later");
      }
    });
  };

  const sendFriendRequest = (usernameOrEmail: string) => {
    post<IPublicUser>(APIRoutes.SEND_FRIEND_REQUEST, {
      usernameOrEmail: usernameOrEmail,
    }).then((res) => {
      if (res.status === 201 && res.data && friendsRequestSent.data) {
        let data = friendsRequestSent.data;
        data.push(res.data);
        setFriendsRequestSent({ ...friendsRequestSent, data: data });
        pushInfo("Friend request sent");
      } else if (res.status === 409) {
        pushDanger("Request already sent");
      } else {
        pushDanger("Cannot send friend request, try again later.");
      }
    });
  };

  const cancelFriendRequest = (friend: IPublicUser) => {
    remove(APIRoutes.DELETE_FRIEND(friend.username)).then((res) => {
      if (res.status === 200 && friendsRequestSent.data) {
        let data = friendsRequestSent.data;
        data = data.filter((f) => f.username !== friend.username);
        setFriendsRequestSent({ ...friendsRequestSent, data: data });
        pushInfo("Friends request canceled");
      } else {
        pushDanger("Cannot cancel friend request, try again later.");
      }
    });
  };

  return {
    friends,
    friendsRequestSent,
    friendsRequestReceived,
    removeFriend,
    acceptFriendRequest,
    refuseFriendRequest,
    sendFriendRequest,
    cancelFriendRequest,
  };
};
