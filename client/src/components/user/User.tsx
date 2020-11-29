import React from "react";
import { Link, Route } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../router/routes";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Spinner from "../elements/Spinner";

const UserPictureStyle = styled.img`
  object-fit: cover;
  width: 260px;
  height: 260px;
`;

const User = () => {
  const user = useCurrentUser();

  if (user === null) return <Spinner color="primary" />;

  return (
    <section className="container is-fluid" data-testid="Profile">
      <br />

      <div className="columns is-desktop is-fullwidth">
        <div className="column is-one-quarter-desktop">
          <div className="tile is-ancestor" data-testid="UserProfileContainer">
            <div className="tile is-parent is-vertical">
              <div className="tile is-child has-text-centered">
                <UserPictureStyle
                  src={user.avatar}
                  alt="User"
                  data-testid="UserProfileImage"
                />
              </div>
              <div className="tile is-child has-text-centered">
                <p className="is-size-5" data-testid="UserProfileUsername">
                  <i>{"@" + user.username}</i>
                </p>
                <p className="is-size-5" data-testid="UserProfileEmail">
                  {user.email}
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

export { User };
