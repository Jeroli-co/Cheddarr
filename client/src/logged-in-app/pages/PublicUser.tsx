import React from "react";
import { useParams } from "react-router";
import { usePublicUser } from "../../shared/hooks/usePublicUser";
import { SwitchErrors } from "../../shared/components/errors/SwitchErrors";
import { Image } from "../../shared/components/Image";
import { PrimaryDivider } from "../../shared/components/Divider";
import { Spinner } from "../../shared/components/Spinner";

type RouteParams = {
  username: string;
};

const PublicUser = () => {
  const { username } = useParams<RouteParams>();
  const user = usePublicUser(username);

  if (user.isLoading) return <Spinner />;

  if (user.data === null) return <SwitchErrors status={user.status} />;

  return (
    <div className="FriendProfile container has-text-centered">
      <PrimaryDivider />
      <div className="container">
        <Image src={user.data.avatar} alt="User" width="260px" height="260px" />
        <p className="is-size-5">
          <i>{"@" + user.data.username}</i>
        </p>
      </div>
    </div>
  );
};

export { PublicUser };
