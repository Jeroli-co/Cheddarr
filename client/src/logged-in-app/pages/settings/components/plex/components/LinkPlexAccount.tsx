import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
import { useAuthentication } from "../../../../../../logged-out-app/contexts/AuthenticationContext";
import { usePlexConfig } from "../../../../../contexts/PlexConfigContext";

const LinkPlexAccount = () => {
  const { isPlexAccountLinked } = usePlexConfig();
  const { signInWithPlex } = useAuthentication();

  if (isPlexAccountLinked()) {
    return (
      <p className="is-size-5 is-size-7-mobile has-text-weight-light">
        <FontAwesomeIcon className="has-text-success" icon={faCheck} /> Plex
        account linked
      </p>
    );
  } else {
    return (
      <button
        className="button is-primary"
        type="button"
        onClick={() => signInWithPlex()}
      >
        Link Plex account
      </button>
    );
  }
};

export { LinkPlexAccount };
