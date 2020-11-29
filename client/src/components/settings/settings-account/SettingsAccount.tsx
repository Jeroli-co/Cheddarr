import * as React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../router/routes";

const SettingsAccountBody = () => {
  const history = useHistory();

  return (
    <div className="container">
      <div className="columns has-text-centered-mobile">
        <div id="action-column" className="column is-half-desktop">
          {/* CHANGE USERNAME */}
          <h3 className="subtitle is-3">Change username</h3>
          <div className="content">
            <p className="is-size-7">
              <FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights
              not recognize you !
            </p>
            <button
              className="button is-primary"
              type="button"
              onClick={() => history.push(routes.CHANGE_USERNAME.url)}
            >
              Change username
            </button>
          </div>

          <div className="is-divider" data-content="OR" />

          {/* CHANGE PASSWORD */}
          <h3 className="subtitle is-3">Change password</h3>
          <div className="content">
            <p className="is-size-7">
              <FontAwesomeIcon icon={faExclamationCircle} /> You will need to
              sign in again after
            </p>
            <button
              className="button is-primary"
              type="button"
              onClick={() => history.push(routes.CHANGE_PASSWORD.url)}
            >
              Change password
            </button>
          </div>

          <div className="is-divider" data-content="OR" />

          {/* CHANGE EMAIL */}
          <h3 className="subtitle is-3">Change email</h3>
          <div className="content">
            <p className="is-size-7">
              <FontAwesomeIcon icon={faExclamationCircle} /> You will need to
              confirm your new email
            </p>
            <button
              className="button is-primary"
              type="button"
              onClick={() => history.push(routes.CHANGE_EMAIL.url)}
            >
              Change email
            </button>
          </div>

          <div className="is-divider is-danger" data-content="OR" />

          {/* DELETE ACCOUNT */}
          <h3 className="subtitle is-3 is-danger">Delete</h3>
          <div className="content">
            <p className="is-size-7">
              <FontAwesomeIcon icon={faExclamationCircle} /> Be careful with
              that option
            </p>
            <button
              className="button is-danger"
              type="button"
              onClick={() => history.push(routes.DELETE.url)}
            >
              Delete account
            </button>
          </div>
        </div>

        <div id="fake-column" className="column" />
      </div>
    </div>
  );
};

const DefaultRoute = () => {
  return <div />;
};

const SettingsAccount = () => {
  return (
    <div className="SettingsAccount" data-testid="SettingsAccount">
      <SettingsAccountBody />
      <Switch>
        <Route
          exact
          path={routes.USER_SETTINGS_ACCOUNT.url}
          component={DefaultRoute}
        />
        <Route
          exact
          path={routes.CHANGE_USERNAME.url}
          component={routes.CHANGE_USERNAME.component}
        />
        <Route
          exact
          path={routes.CHANGE_EMAIL.url}
          component={routes.CHANGE_EMAIL.component}
        />
        <Route
          exact
          path={routes.CHANGE_PASSWORD.url}
          component={routes.CHANGE_PASSWORD.component}
        />
        <Route
          exact
          path={routes.DELETE.url}
          component={routes.DELETE.component}
        />
        <Route render={() => <Redirect to={routes.NOT_FOUND.url} />} />
      </Switch>
    </div>
  );
};

export { SettingsAccount };
