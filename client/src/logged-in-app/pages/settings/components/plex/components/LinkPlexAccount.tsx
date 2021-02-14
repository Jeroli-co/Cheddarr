import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { usePlexConfig } from "../../../../../../shared/contexts/PlexConfigContext";
import { usePlexAuth } from "../../../../../../shared/contexts/PlexAuthContext";
import { SecondaryButton } from "../../../../../../shared/components/Button";
import { H2 } from "../../../../../../shared/components/Titles";
import { Icon } from "../../../../../../shared/components/Icon";
import { useTheme } from "styled-components";

const LinkPlexAccount = () => {
  const { isPlexAccountLinked } = usePlexConfig();
  const { signInWithPlex } = usePlexAuth();
  const theme = useTheme();

  if (isPlexAccountLinked()) {
    return (
      <H2>
        <Icon color={theme.success} icon={faCheck} /> Plex account linked
      </H2>
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
