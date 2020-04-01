import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../contexts/AuthContext";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SettingsConfigurations = () => {

  const { signInWithPlex, getPlexConfig } = useContext(AuthContext);
  const [hasPlexAPIKey, setHasPlexAPIKey] = useState(null);

  useEffect(() => {
    getPlexConfig().then((res) => {
      if (res) {
        switch (res.status) {
          case 200:
            setHasPlexAPIKey(true);
            return;
          case 404:
            setHasPlexAPIKey(false);
            return;
          default:
            return;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="SettingsConfigurations container" data-testid="SettingsConfigurations">
      <h1 className="title is-1">Plex</h1>
      <hr/>
      { hasPlexAPIKey !== null &&
        (
          (hasPlexAPIKey && (
            <div className="content has-text-success">
              <p className="is-size-3"><FontAwesomeIcon icon={faCheck}/> <span className="is-size-4 has-text-weight-light">Plex account linked</span></p>
              <button className="button is-primary" type="button">
                Link Plex server
              </button>
            </div>
          )) ||
          (
            <button className="button is-primary" type="button" onClick={() => signInWithPlex()}>
              Link Plex account
            </button>
          )
        )
      }
    </div>
  )
};

export {
  SettingsConfigurations
}