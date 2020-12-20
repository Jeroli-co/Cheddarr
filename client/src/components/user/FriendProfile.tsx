import * as React from "react";
import { useParams } from "react-router";
import Spinner from "../elements/Spinner";
import { usePublicUser } from "../../hooks/usePublicUser";

type FriendProfileRouteParams = {
  id: string;
};

const FriendProfile = () => {
  const { id } = useParams<FriendProfileRouteParams>();
  const friend = usePublicUser(id);

  if (friend === null) return <Spinner />;

  return (
    <div
      className="FriendProfile container has-text-centered"
      data-testid="FriendProfile"
    >
      <div className="is-divider" data-content="Profile" />
      <div className="container">
        <img
          src={friend.avatar}
          alt="User"
          width={260}
          height={260}
          data-testid="UserPublicProfileImage"
        />
        <p className="is-size-5" data-testid="UserPublicProfileUsername">
          <i>{"@" + friend.username}</i>
        </p>
      </div>
    </div>
  );
};

export { FriendProfile };
