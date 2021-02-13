import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../../../router/routes";
import { PrimaryButton } from "../../../../../shared/components/Button";
import { H1, H2 } from "../../../../../shared/components/Titles";
import { Help } from "../../../../../shared/components/Help";

const SettingsAccountBody = () => {
  const history = useHistory();

  return (
    <section>
      <H1>Account</H1>
      <br />
      <div>
        {/* CHANGE USERNAME */}
        <H2>Change username</H2>
        <div className="content">
          <Help>
            <FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights
            not recognize you !
          </Help>
          <PrimaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_USERNAME_MODAL.url)}
          >
            Change username
          </PrimaryButton>
        </div>

        <br />

        {/* CHANGE PASSWORD */}
        <H2>Change password</H2>
        <div className="content">
          <Help>
            <FontAwesomeIcon icon={faExclamationCircle} /> You will need to sign
            in again after
          </Help>
          <PrimaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_PASSWORD_MODAL.url)}
          >
            Change password
          </PrimaryButton>
        </div>

        <br />

        {/* CHANGE EMAIL */}
        <H2>Change email</H2>
        <div className="content">
          <Help>
            <FontAwesomeIcon icon={faExclamationCircle} /> You will need to
            confirm your new email
          </Help>
          <PrimaryButton
            type="button"
            onClick={() => history.push(routes.CHANGE_EMAIL_MODAL.url)}
          >
            Change email
          </PrimaryButton>
        </div>

        <br />

        {/* DELETE_ACCOUNT_MODAL ACCOUNT */}
        <H2>Delete account</H2>
        <div className="content">
          <Help>
            <FontAwesomeIcon icon={faExclamationCircle} /> Be careful with that
            option
          </Help>
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
    <div>
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
      </Switch>
    </div>
  );
};

export { SettingsAccount };
