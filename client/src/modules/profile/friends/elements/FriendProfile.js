import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {FriendsContext} from "../../../../contexts/FriendsContext";

const FriendProfile = () => {

  const { id } = useParams();
  const { getFriend } = useContext(FriendsContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getFriend(id).then(res => {
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