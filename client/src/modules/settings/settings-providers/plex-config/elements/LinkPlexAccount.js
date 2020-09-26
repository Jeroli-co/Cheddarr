import React, { useContext } from "react";
import { AuthContext } from "../../../../auth/contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { PlexConfigContext } from "../../../../providers/plex/contexts/PlexConfigContext";

const LinkPlexAccount = ({ config, location }) => {
  const { signInWithPlex } = useContext(AuthContext);
  const { isPlexAccountLinked } = useContext(PlexConfigContext);

  if (!isPlexAccountLinked(config)) {
    return (
      <button
        className="button is-primary"
        type="button"
        onClick={() => signInWithPlex(location.pathname)}
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
