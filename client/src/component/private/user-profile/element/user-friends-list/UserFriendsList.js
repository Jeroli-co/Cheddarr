import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from "../../../../../context/AuthContext";
import './UserFriendsList.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {routes} from "../../../../../routes";

const UserFriendsList = () => {

  const { getFriends, addFriend, deleteFriend } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  const searchFriendsInput = useRef();
  const [addFriendsHttpResponse, setAddFriendsHttpResponse] = useState(null);

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

  const _onAddFriend = () => {
    const inputValue = searchFriendsInput.current.value;
    if (inputValue.replace(/\s/g,'').length > 0) {
      addFriend(inputValue).then(res => {
        switch (res.status) {
          case 200:
            setAddFriendsHttpResponse(res);
            console.log(res);
            return;
          case 409:
            setAddFriendsHttpResponse(res);
            return;
          case 404:
            setAddFriendsHttpResponse(res);
            return;
          default:
            return;
        }
      });
    }
  };

  const FriendsList = ({ friends }) => {
    const list = friends.map((friend) => {
      return (
        <div key={friend.username} className="FriendsList">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src={friend["user_picture"]} alt="User" />
                </figure>
              </div>
              <div className="level-item">
                <Link className="is-size-5" to={routes.USER_PUBLIC_PROFILE.url(friend.username)}><i>{'@' + friend.username}</i></Link>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button className="button is-danger is-small" type="button" onClick={() => _onDeleteFriend(friend.username)}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faMinus}/>
                  </span>
                </button>
              </div>
            </div>
          </div>
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
      <div className="container">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="field has-addons">
                <div className="control has-icons-left">
                  <input className="input" type="search" ref={searchFriendsInput} placeholder="Add friends" autoComplete="off" />
                  <span className="icon is-small is-left"><FontAwesomeIcon icon={faSearch} /></span>
                </div>
                <div className="control">
                  <button className="button is-success" onClick={_onAddFriend}>
                    <span className="icon is-small"><FontAwesomeIcon icon={faPlus} /></span>
                  </button>
                </div>
              </div>
            </div>
            { addFriendsHttpResponse &&
              <div className="level-item">
                {
                  (addFriendsHttpResponse.status === 200 && <p className="help is-success">{addFriendsHttpResponse.message}</p>) ||
                  (addFriendsHttpResponse.status === 409 && <p className="help is-danger">{addFriendsHttpResponse.message}</p>) ||
                  (addFriendsHttpResponse.status === 404 && <p className="help is-danger">{addFriendsHttpResponse.message}</p>)
                }
              </div>
            }
          </div>
        </div>
        <hr/>
        <FriendsList friends={friends}/>

      </div>
    </div>
  )
};

export {
  UserFriendsList
}