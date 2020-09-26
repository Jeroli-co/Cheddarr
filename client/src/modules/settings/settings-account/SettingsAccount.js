import React, { useContext } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faExclamationCircle,
  faSyncAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../router/routes";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";
import { useApiKey } from "../../user/profile/hooks/useApiKey";

const SettingsAccountBody = () => {
  const { apiKey, resetApiKey, deleteApiKey } = useApiKey();
  const { pushSuccess } = useContext(NotificationContext);
  const history = useHistory();

  const _onCopyToClipboard = () => {
    const copyText = document.getElementById("apiKeyInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    pushSuccess("API Key copied");
  };

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

          <div className="is-divider" data-content="OR" />

          {/* API KEY */}
          <h3 className="subtitle is-3 is-danger">API Key</h3>
          <div className="content">
            <div className="columns">
              <div className="column is-two-thirds">
                <input
                  id="apiKeyInput"
                  className="input is-primary"
                  type="text"
                  disabled={apiKey.length === 0}
                  placeholder="No api key is set"
                  value={apiKey}
                  readOnly={true}
                  contentEditable={false}
                />
              </div>
              <div className="column">
                <div className="buttons">
                  {apiKey.length > 0 && (
                    <button
                      className="button is-rounded is-info"
                      type="button"
                      onClick={_onCopyToClipboard}
                      data-tooltip="Copy to clipboard"
                    >
                      <span className="icon">
                        <FontAwesomeIcon icon={faCopy} />
                      </span>
                    </button>
                  )}
                  <button
                    className="button is-rounded is-info"
                    type="button"
                    onClick={resetApiKey}
                    data-tooltip="Generate new API key"
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </span>
                  </button>
                  {apiKey.length > 0 && (
                    <button
                      className="button is-rounded is-danger"
                      type="button"
                      onClick={deleteApiKey}
                      data-tooltip="Delete API key"
                    >
                      <span className="icon">
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
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
