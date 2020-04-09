import React, {useEffect, useState} from 'react';
import './Friends.scss';
import {AddFriendsInput} from "./elements/AddFriendsInput";
import {FriendsList} from "./elements/FriendsList";
import {RequestedList} from "./elements/RequestedList";
import {ReceivedList} from "./elements/ReceivedList";
import {useFriends} from "../../../hooks/useFriends";

const Friends = () => {

  const [friends, setFriends] = useState([]);
  const [requested, setRequested] = useState([]);
  const [received, setReceived] = useState([]);

  const { getFriends, getReceived, getRequested, cancelFriend,
    acceptRequest, refuseFriend, deleteFriend, addFriend } = useFriends();

  useEffect(() => {
    getFriends().then(data => {
      if (data) setFriends(data);
    });

    getRequested().then(data => {
      if (data) setRequested(data);
    });

    getReceived().then(data => {
      if (data) setReceived(data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelFriendRequest = async (username) => {
    const res = await cancelFriend(username);
    if (res) setRequested(requested.filter(user => user.username !== username));
  };

  const refuseFriendRequest = async (username) => {
    const res = await refuseFriend(username);
    if (res) setReceived(received.filter(user => user.username !== username));
  };

  const acceptFriendRequest = async (username) => {
    const res = await acceptRequest(username);
    if (res) {
      setReceived(received.filter(friend => friend.username !== username));
      setFriends(friends.concat([res.data]));
    }
  };

  const removeFriend = async (username) => {
    const res = await deleteFriend(username);
    if (res) setFriends(friends.filter(friend => friend.username !== username));
  };

  const sendFriendRequest = async (username) => {
    const res = await addFriend(username);
    if (res) {
      switch (res.status) {
        case 201:
          setRequested(requested.concat([res.data]));
          return res;
        default:
          return res;
      }
    }
  };

  return (
    <div className="Friends" data-testid="Friends">

      <AddFriendsInput sendFriendRequest={sendFriendRequest}/>

      <hr/>

      <div className="columns">
        <div className="column is-half">
          <FriendsList friends={friends} removeFriend={removeFriend}/>
        </div>
        <div className="column">
          <ReceivedList received={received} acceptRequest={acceptFriendRequest} refuseRequest={refuseFriendRequest}/>
          <hr/>
          <RequestedList requested={requested} cancelRequest={cancelFriendRequest}/>
        </div>
      </div>

    </div>
  )
};

export {
  Friends
}