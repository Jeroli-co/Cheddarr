import React from "react";
import { Link, Route } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../../routes";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Spinner from "../../../shared/components/Spinner";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";

const UserPictureStyle = styled.img`
  object-fit: cover;
  width: 260px;
  height: 260px;
`;

const UserProfile = () => {
  const user = useCurrentUser();

  if (user.isLoading) return <Spinner color="primary" />;

  if (user.data === null) return <SwitchErrors status={user.status} />;

  return (
    <section className="container is-fluid" data-testid="Profile">
      <br />

      <div className="columns is-desktop is-fullwidth">
        <div className="column is-one-quarter-desktop">
          <div className="tile is-ancestor" data-testid="UserProfileContainer">
            <div className="tile is-parent is-vertical">
              <div className="tile is-child has-text-centered">
                <UserPictureStyle
                  src={user.data.avatar}
                  alt="User"
                  data-testid="UserProfileImage"
                />
              </div>
              <div className="tile is-child has-text-centered">
                <p className="is-size-5" data-testid="UserProfileUsername">
                  <i>{"@" + user.data.username}</i>
                </p>
                <p className="is-size-5" data-testid="UserProfileEmail">
                  {user.data.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="tabs is-boxed">
            <ul>
              <li className="is-active">
                <Link to={routes.USER_FRIENDS.url}>Friends</Link>
              </li>
            </ul>
          </div>

          <Route
            path={[routes.USER_PROFILE.url, routes.USER_FRIENDS.url]}
            component={routes.USER_FRIENDS.component}
          />
        </div>
      </div>
    </section>
  );
};

export { UserProfile };
