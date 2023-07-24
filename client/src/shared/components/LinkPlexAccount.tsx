import * as React from "react";
import { usePlexAuth } from "../contexts/PlexAuthContext";
import { SecondaryButton } from "./Button";

type LinkPlexAccountProps = {
  redirectURI?: string;
};

export const LinkPlexAccount = (props: LinkPlexAccountProps) => {
  const { signInWithPlex } = usePlexAuth();
  return (
    <SecondaryButton
      type="button"
      onClick={() =>
        props.redirectURI ? signInWithPlex(props.redirectURI) : signInWithPlex()
      }
    >
      Link Plex account
    </SecondaryButton>
  );
};
