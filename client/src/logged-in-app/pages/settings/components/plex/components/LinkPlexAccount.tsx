import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { usePlexConfig } from "../../../../../../shared/contexts/PlexConfigContext";
import { usePlexAuth } from "../../../../../../shared/contexts/PlexAuthContext";
import { SecondaryButton } from "../../../../../../shared/components/Button";

const LinkPlexAccount = () => {
  const { isPlexAccountLinked } = usePlexConfig();
  const { signInWithPlex } = usePlexAuth();

  if (isPlexAccountLinked()) {
    return (
      <p className="is-size-5 is-size-7-mobile has-text-weight-light">
        <FontAwesomeIcon className="has-text-success" icon={faCheck} /> Plex
        account linked
      </p>
    );
  } else {
    return (
      <SecondaryButton type="button" onClick={() => signInWithPlex()}>
        Link Plex account
      </SecondaryButton>
    );
  }
};

export { LinkPlexAccount };
