import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../../../context/AuthContext";
import './UserFriendsList.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";

const UserFriendsList = () => {

  const { getFriends, deleteFriend } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends().then(res => {
      switch (res.status) {
        case 200:
          setFriends(res.data || []);
          return;
        default:
          return;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onDeleteFriend = (friendUsername) => {
    deleteFriend(friendUsername).then(res => {
      switch (res.status) {
        case 200:
          setFriends(friends.filter(friend => friend.username !== friendUsername));
          return;
        default:
          return;
      }
    })
  };

  const FriendsList = ({ friends }) => {
    const list = friends.map((friend) => {
      return (
        <div className="FriendsList">
          <div key={friend.username} className="friend-item">
            <div className="friend-item-info">
              <figure className="image is-64x64">
                <img src={friend["user_picture"]} alt="User" />
              </figure>
              <p className="is-size-5"><i>{'@' + friend.username}</i></p>
            </div>
            <button className="button is-danger is-small" type="button" onClick={() => _onDeleteFriend(friend.username)}>
              <span className="icon">
                <FontAwesomeIcon icon={faMinus}/>
              </span>
            </button>
          </div>
          <div className="is-divider"/>
        </div>
      )
    });

    return (
      <div className="container friends-list-container">
        {list}
      </div>
    )
  };

  return (
    <div className="UserFriendsList" data-testid="UserFriendsList">
      <FriendsList friends={friends}/>
    </div>
  )
};

export {
  UserFriendsList
}