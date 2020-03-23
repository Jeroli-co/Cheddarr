import React from 'react';
import {Route} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {routes} from "../../../../../routes";

const UserSettingsProfile = (props) => {

  return (
    <div className="UserSettingsProfile" data-testid="UserSettingsProfile">
      <div className="container">
        <div className="columns is-mobile">
          <div id="action-column" className="column is-half">

            <h3 className="subtitle is-3">Change username</h3>
            <div className="content">
              <p className="is-size-7"><FontAwesomeIcon icon={faExclamationCircle} /> Your friends mights not recognize you !</p>
              <button className="button is-primary" type="button" onClick={() => props.history.push(routes.CHANGE_USERNAME.url)}>
                Change username
              </button>
            </div>

            <div className="is-divider" data-content="OR"/>

            <h3 className="subtitle is-3">Change password</h3>
            <div className="content">
              <p className="is-size-7"><FontAwesomeIcon icon={faExclamationCircle} /> You will have to sign in again after that</p>
              <button className="button is-primary" type="button" onClick={() => props.history.push(routes.CHANGE_PASSWORD.url)}>
                Change password
              </button>
            </div>

            <div className="is-divider" data-content="OR"/>

            <h3 className="subtitle is-3">Change email</h3>
            <div className="content">
              <p className="is-size-7"><FontAwesomeIcon icon={faExclamationCircle} /> You will have to confirm your new email before changes apply</p>
              <button className="button is-primary" type="button" onClick={() => props.history.push(routes.CHANGE_EMAIL.url)}>
                Change email
              </button>
            </div>

            <div className="is-divider is-danger" data-content="OR"/>

            <h3 className="subtitle is-3 is-danger">Delete</h3>
            <div className="content">
              <p className="is-size-7"><FontAwesomeIcon icon={faExclamationCircle} /> Careful with that option</p>
              <button className="button is-danger" type="button" onClick={() => props.history.push(routes.DELETE.url)}>
                Delete account
              </button>
            </div>

          </div>

          <div id="fake-column" className="column"/>

        </div>
      </div>
      <Route exact path={routes.CHANGE_PASSWORD.url} component={routes.CHANGE_PASSWORD.component} />
      <Route exact path={routes.CHANGE_USERNAME.url} component={routes.CHANGE_USERNAME.component} />
      <Route exact path={routes.CHANGE_EMAIL.url} component={routes.CHANGE_EMAIL.component} />
      <Route exact path={routes.DELETE.url} component={routes.DELETE.component} />
    </div>
  );

};

export {
  UserSettingsProfile
}