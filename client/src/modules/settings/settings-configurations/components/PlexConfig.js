import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../../contexts/AuthContext";
import {usePlexConfig} from "../../../../hooks/usePlexConfig";

const PlexConfig = ({ location }) => {

  const { providerApiKey, machineId, loading } = usePlexConfig();

  const isPlexAccountLinked = () => {
    return providerApiKey !== null;
  };

  const isPlexServerLinked = () => {
    return machineId !== null;
  };

  if (loading) return <div/>;

  return (
    <div className="content has-text-success">
      <LinkPlexAccount linked={isPlexAccountLinked()} redirectURI={location.pathname}/>
      { isPlexAccountLinked() && <LinkPlexServer linked={isPlexServerLinked()}/> }
    </div>
  );
};

const LinkPlexAccount = ({ linked, redirectURI }) => {

  const { signInWithPlex } = useContext(AuthContext);

  if (linked) {
    return <p className="is-size-3"><FontAwesomeIcon icon={faCheck}/> <span className="is-size-4 has-text-weight-light">Plex account linked</span></p>;
  } else {
    return (
      <button className="button is-primary" type="button" onClick={() => signInWithPlex(redirectURI)}>
        Link Plex account
      </button>
    )
  }
};

const LinkPlexServer = ({ linked }) => {

  const { getPlexServer } = useContext(AuthContext);

  const _onClickLinkServer = () => {
    getPlexServer().then(res => {
      if (res) {
        console.log(res);
      }
    });
  };

  if (linked) {
    return <p className="is-size-3"><FontAwesomeIcon icon={faCheck}/> <span className="is-size-4 has-text-weight-light">Plex server linked</span></p>;
  } else {
    return (
      <button className="button is-primary" type="button" onClick={_onClickLinkServer}>
        Link Plex server
      </button>
    )
  }
};

export {
  PlexConfig
}