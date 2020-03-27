import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../../contexts/AuthContext";

const FriendProfile = () => {

  const { id } = useParams();
  const { getUserPublic } = useContext(AuthContext);
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

  return (
    <div className="UserPublicProfile container has-text-centered" data-testid="UserPublicProfile">

      <div className="is-divider" data-content="Profile"/>

      { user &&
        <div className="container">
          <img src={user["user_picture"]} alt="User" width={260} height={260} data-testid="UserPublicProfileImage" />
          <p className="is-size-5" data-testid="UserPublicProfileUsername"><i>{'@' + user.username}</i></p>
        </div>
      }

    </div>
  )
};

export {
  FriendProfile
}