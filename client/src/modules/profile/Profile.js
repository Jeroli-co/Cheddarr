import React, { useContext, useEffect, useState } from "react";
import { routes } from "../../router/routes";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import styled from "styled-components";

const UserPictureStyle = styled.img`
  object-fit: cover;
  width: 260px;
  height: 260px;
`;

const Profile = () => {
  const { getUser } = useProfile();
  const { username, avatar } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then((res) => {
      if (res) setUser(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="Profile container is-fluid" data-testid="Profile">
      <br />

      <div className="columns is-desktop is-fullwidth">
        <div className="column is-one-quarter-desktop">
          {user && (
            <div
              className="tile is-ancestor"
              data-testid="UserProfileContainer"
            >
              <div className="tile is-parent is-vertical">
                <div className="tile is-child has-text-centered">
                  <UserPictureStyle
                    src={avatar}
                    alt="User"
                    data-testid="UserProfileImage"
                  />
                </div>
                <div className="tile is-child has-text-centered">
                  <p className="is-size-5" data-testid="UserProfileUsername">
                    <i>{"@" + username}</i>
                  </p>
                  <p className="is-size-5" data-testid="UserProfileEmail">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
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

export { Profile };
