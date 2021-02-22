import React, { useEffect, useState } from "react";
import { usePlexServers } from "../../../../../shared/hooks/usePlexServers";
import { Spinner } from "../../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../../shared/enums/ComponentSizes";
import { MediaServerRadio } from "../components/MediaServerRadio";
import { IMediaServerInfo } from "../../../../../shared/models/IMediaServerInfo";
import { H3 } from "../../../../../shared/components/Titles";
import { APIRoutes } from "../../../../../shared/enums/APIRoutes";
import { useAPI } from "../../../../../shared/hooks/useAPI";
import { Divider } from "../../../../../shared/components/Divider";
import { PlexSettingsForm } from "./PlexSettingsForm";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { usePlexConfig } from "../../../../../shared/contexts/PlexConfigContext";

type AddPlexSettingsProps = {
  closeModal: () => void;
};

export const AddPlexSettings = (props: AddPlexSettingsProps) => {
  const servers = usePlexServers();
  const [selectedServer, setSelectedServer] = useState<IMediaServerInfo | null>(
    null
  );
  const [
    selectedServerConfig,
    setSelectedServerConfig,
  ] = useState<IPlexSettings | null>(null);
  const { get } = useAPI();
  const { isPlexAccountLinked } = usePlexConfig();

  useEffect(() => {
    if (selectedServer) {
      get<IPlexSettings>(
        APIRoutes.GET_PLEX_SERVER(selectedServer.serverName)
      ).then((plexConfig) => {
        if (plexConfig.data && plexConfig.status === 200) {
          setSelectedServerConfig(plexConfig.data);
        }
      });
    }
  }, [selectedServer]);

  return (
    <div>
      <H3>Select a server or add one manually</H3>

      <br />
      {isPlexAccountLinked() && (
        <div>
          {servers.isLoading && <Spinner size={ComponentSizes.LARGE} />}
          {!servers.isLoading &&
            servers.data &&
            servers.data.map((server) => {
              return (
                <MediaServerRadio
                  key={server.serverName}
                  serverName={server.serverName}
                  isSelected={
                    selectedServer !== null &&
                    selectedServer.serverId === server.serverId
                  }
                  select={() => setSelectedServer(server)}
                />
              );
            })}
        </div>
      )}

      {isPlexAccountLinked() && <Divider />}

      <PlexSettingsForm
        config={selectedServerConfig}
        closeModal={props.closeModal}
      />
    </div>
  );
};
