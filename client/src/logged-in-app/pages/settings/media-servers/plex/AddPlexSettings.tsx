import React, { useEffect, useState } from "react";
import { usePlexServers } from "../../../../../shared/hooks/usePlexServers";
import { Spinner } from "../../../../../shared/components/Spinner";
import { ComponentSizes } from "../../../../../shared/enums/ComponentSizes";
import { Divider } from "../../../../../shared/components/Divider";
import { PlexSettingsForm } from "./PlexSettingsForm";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { LinkPlexAccount } from "../../../../../shared/components/LinkPlexAccount";
import { useLocation } from "react-router-dom";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { H3 } from "../../../../../shared/components/Titles";

type AddPlexSettingsProps = {
  closeModal: () => void;
};

export const AddPlexSettings = (props: AddPlexSettingsProps) => {
  const servers = usePlexServers();
  const [selectedServerName, setSelectedServerName] = useState<string | null>(
    null
  );
  const [
    selectedServerConfig,
    setSelectedServerConfig,
  ] = useState<IPlexSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (selectedServerName) {
      const server =
        servers.data &&
        servers.data.find((s) => s.serverName === selectedServerName);
      if (server) {
        setSelectedServerConfig(server);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServerName]);

  useEffect(() => {
    if (servers.data && servers.data.length > 0) {
      setSelectedServerName(servers.data[0].serverName);
    }
  }, [servers.data]);

  return (
    <div>
      <div>
        {servers.isLoading && <Spinner size={ComponentSizes.LARGE} />}
        {!servers.isLoading && servers.status === 404 && (
          <LinkPlexAccount redirectURI={location.pathname} />
        )}
        {!servers.isLoading && servers.data && (
          <>
            <H3>Account servers</H3>
            <InputField>
              <select onChange={(e) => setSelectedServerName(e.target.value)}>
                {servers.data.map((server, index) => {
                  return (
                    <option key={index} value={server.serverName}>
                      {server.serverName}
                    </option>
                  );
                })}
              </select>
            </InputField>
          </>
        )}
      </div>

      <Divider />

      <PlexSettingsForm config={selectedServerConfig} />
    </div>
  );
};
