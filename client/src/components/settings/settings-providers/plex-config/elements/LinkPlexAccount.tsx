import React, { MouseEvent, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { PlexConfigContext } from "../../../../../contexts/plex-config/PlexConfigContext";
import { AuthService } from "../../../../../services/AuthService";
import { useLocation } from "react-router";

const LinkPlexAccount = () => {
  const { isPlexAccountLinked } = useContext(PlexConfigContext);
  const location = useLocation();

  const onSignInWithPlex = (e: MouseEvent) => {
    AuthService.signInWithPlex(location.pathname);
    e.preventDefault();
  };

  if (!isPlexAccountLinked()) {
    return (
      <button
        className="button is-primary"
        type="button"
        onClick={onSignInWithPlex}
      >
        Link Plex account
      </button>
    );
  }

  return (
    <p className="is-size-5 is-size-7-mobile has-text-weight-light">
      <FontAwesomeIcon className="has-text-success" icon={faCheck} /> Plex
      account linked
    </p>
  );
};

export { LinkPlexAccount };
