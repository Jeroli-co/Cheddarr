import React from "react";
import { H1, H3 } from "../../../../shared/components/Titles";
import { PrimaryDivider } from "../../../../shared/components/Divider";
import { Help } from "../../../../shared/components/Help";
import { Icon } from "../../../../shared/components/Icon";
import {
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  DangerButton,
  SecondaryButton,
} from "../../../../shared/components/Button";
import { usePlexConfig } from "../../../../shared/contexts/PlexConfigContext";
import { usePlexAuth } from "../../../../shared/contexts/PlexAuthContext";
import { useTheme } from "styled-components";

export const ConnectionsSettings = () => {
  const { isPlexAccountLinked, unlinkPlexAccount } = usePlexConfig();
  const { signInWithPlex } = usePlexAuth();
  const theme = useTheme();

  return (
    <div>
      <H1>Plex</H1>
      <PrimaryDivider />
      {isPlexAccountLinked() && (
        <H3>
          <Icon color={theme.success} icon={faCheck} /> Plex account linked
        </H3>
      )}
      {!isPlexAccountLinked() && (
        <SecondaryButton type="button" onClick={() => signInWithPlex()}>
          Link Plex account
        </SecondaryButton>
      )}
      {isPlexAccountLinked() && (
        <>
          <br />
          <DangerButton type="button" onClick={() => unlinkPlexAccount()}>
            Unlink Plex Account
          </DangerButton>
          <Help>
            <Icon icon={faExclamationCircle} /> Your plex account will be
            unlink, we won't be able to see your servers and more...
          </Help>
        </>
      )}
    </div>
  );
};
