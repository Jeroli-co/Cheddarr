import React, { useEffect, useState } from "react";
import { usePlexServers } from "../../../../../shared/hooks/usePlexServers";
import { Spinner } from "../../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../../shared/enums/ComponentSizes";
import { MediaServerRadio } from "../MediaServerRadio";
import { Divider } from "../../../../../shared/components/Divider";
import { PlexSettingsForm } from "./PlexSettingsForm";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { LinkPlexAccount } from "../../../../../shared/components/LinkPlexAccount";
import { useLocation } from "react-router-dom";

type AddPlexSettingsProps = {
  closeModal: () => void;
};

export const AddPlexSettings = (props: AddPlexSettingsProps) => {
  const servers = usePlexServers();
  const [selectedServer, setSelectedServer] = useState<IPlexSettings | null>(
    null
  );
  const [
    selectedServerConfig,
    setSelectedServerConfig,
  ] = useState<IPlexSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (selectedServer) {
      setSelectedServerConfig(selectedServer);
    }
  }, [selectedServer]);

  return (
    <div>
      <div>
        {servers.isLoading && <Spinner size={ComponentSizes.LARGE} />}
        {!servers.isLoading && servers.status === 404 && (
          <LinkPlexAccount redirectURI={location.pathname} />
        )}
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

      <Divider />

      <PlexSettingsForm config={selectedServerConfig} />
    </div>
  );
};
