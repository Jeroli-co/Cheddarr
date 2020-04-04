import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../../../contexts/AuthContext";
import {ServersModal} from "./ServersModal";
import {PlexConfigContext} from "../../../../../contexts/PlexConfigContext";

const PlexConfig = ({ location }) => {

  const { signInWithPlex } = useContext(AuthContext);
  const { providerApiKey, machineId, loading } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);

  const isPlexAccountLinked = () => {
    return providerApiKey !== null && typeof providerApiKey !== 'undefined';
  };

  const isPlexServerLinked = () => {
    return machineId !== null && typeof machineId !== 'undefined';
  };

  const LinkPlexServer = () => {

    const _onClickLinkServer = () => {
      setIsServersModalActive(true);
    };

    if (isPlexServerLinked()) {
      return <p className="is-size-3"><FontAwesomeIcon icon={faCheck}/> <span className="is-size-4 has-text-weight-light">Plex server linked</span></p>;
    } else {
      return (
        <button className="button is-primary" type="button" onClick={_onClickLinkServer}>
          Link Plex server
        </button>
      )
    }
  };

  if (loading) return <div/>;

  if (!isPlexAccountLinked()) {
    return (
      <button className="button is-primary" type="button" onClick={() => signInWithPlex(location.pathname)}>
        Link Plex account
      </button>
    );
  }

  return (
    <div className="content has-text-success">
      <p className="is-size-3"><FontAwesomeIcon icon={faCheck}/> <span className="is-size-4 has-text-weight-light">Plex account linked</span></p>;
      <LinkPlexServer/>
      { isServersModalActive && <ServersModal/> }
    </div>
  );
};

export {
  PlexConfig
}