import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../../../router/routes";
import { H3 } from "../../../../../shared/components/Titles";
import { SecondaryButton } from "../../../../../experimentals/Button";

const SettingsAccountBody = () => {
  const history = useHistory();

  return (
    <section>
      <div>
        {/* CHANGE USERNAME */}
        <H3>Change username</H3>
        <div className="content">
          <p className="is-size-7">
            <FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights
            not recognize you !
          </p>
          <SecondaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_USERNAME_MODAL.url)}
          >
            Change username
          </SecondaryButton>
        </div>

        {/* CHANGE PASSWORD */}
        <H3>Change password</H3>
        <div className="content">
          <p className="is-size-7">
            <FontAwesomeIcon icon={faExclamationCircle} /> You will need to sign
            in again after
          </p>
          <SecondaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_PASSWORD_MODAL.url)}
          >
            Change password
          </SecondaryButton>
        </div>

        {/* CHANGE EMAIL */}
        <H3>Change email</H3>
        <div className="content">
          <p className="is-size-7">
            <FontAwesomeIcon icon={faExclamationCircle} /> You will need to
            confirm your new email
          </p>
          <SecondaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_EMAIL_MODAL.url)}
          >
            Change email
          </SecondaryButton>
        </div>

        <hr />

        {/* DELETE_ACCOUNT_MODAL ACCOUNT */}
        <H3>Delete account</H3>
        <div className="content">
          <p className="is-size-7">
            <FontAwesomeIcon icon={faExclamationCircle} /> Be careful with that
            option
          </p>
          <button
            className="button is-danger"
            type="button"
            onClick={() => history.push(routes.DELETE_ACCOUNT_MODAL.url)}
          >
            Delete account
          </button>
        </div>
      </div>
    </section>
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
          path={routes.SETTINGS_ACCOUNT.url}
          component={DefaultRoute}
        />
        <Route
          exact
          path={routes.CHANGE_USERNAME_MODAL.url}
          component={routes.CHANGE_USERNAME_MODAL.component}
        />
        <Route
          exact
          path={routes.CHANGE_EMAIL_MODAL.url}
          component={routes.CHANGE_EMAIL_MODAL.component}
        />
        <Route
          exact
          path={routes.CHANGE_PASSWORD_MODAL.url}
          component={routes.CHANGE_PASSWORD_MODAL.component}
        />
        <Route
          exact
          path={routes.DELETE_ACCOUNT_MODAL.url}
          component={routes.DELETE_ACCOUNT_MODAL.component}
        />
        <Route render={() => <Redirect to={routes.NOT_FOUND.url} />} />
      </Switch>
    </div>
  );
};

export { SettingsAccount };
