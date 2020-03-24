import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

const UserPublicProfile = () => {

  const { id } = useParams();
  const { isAuthenticated, username, getUserPublic, addFriend } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserPublic(id).then(res => {
      switch (res.status) {
        case 200:
          setUser(res.data);
          return;
        default:
          return;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onAddUser = () => {
    addFriend(user.username).then(res => {
      switch (res.status) {
        case 200:
          setUser(res.data);
          return;
        default:
          return;
      }
    });
  };

  return (
    <div className="UserPublicProfile container has-text-centered" data-testid="UserPublicProfile">

      <div className="is-divider" data-content="Profile"/>

      { user &&
        <div className="container">
          <img src={user["user_picture"]} alt="User" width={260} height={260} data-testid="UserPublicProfileImage" />
          <p className="is-size-5" data-testid="UserPublicProfileUsername"><i>{'@' + user.username}</i></p>
        </div>
      }

      <br/>

      { isAuthenticated && id !== username &&
        <button className="button is-primary" type="button" disabled={user["is_friend"]} onClick={() => _onAddUser}>
          <span className="icon">
            <FontAwesomeIcon icon={faPlus}/>
          </span>
          <span>Add friends</span>
        </button>
      }

    </div>
  )
};

export {
  UserPublicProfile
}