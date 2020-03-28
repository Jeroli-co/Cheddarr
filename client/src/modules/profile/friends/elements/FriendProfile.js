import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../../contexts/AuthContext";

const FriendProfile = () => {

  const { id } = useParams();
  const { getFriend } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getFriend(id).then(res => setUser(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="FriendProfile container has-text-centered" data-testid="FriendProfile">

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