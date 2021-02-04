import React, { useState } from "react";
import { PrimarySpinner } from "../../../../../../shared/components/Spinner";
import { IPlexServerInfo } from "../models/IPlexServerInfo";
import { usePlexServers } from "../../../../../hooks/usePlexServers";
import { useAPI } from "../../../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../../../shared/enums/APIRoutes";
import { Sizes } from "../../../../../../shared/enums/Sizes";
import { PrimaryOutlinedButton } from "../../../../../../shared/components/Button";
import { IPlexConfig } from "../models/IPlexConfig";

type PlexServerComponentProps = {
  server: IPlexServerInfo;
};

type ServersModalProps = {
  onClose: () => void;
  selectServer: (config: IPlexConfig) => void;
};

const ServersModal = ({ onClose, selectServer }: ServersModalProps) => {
  const [serverSelected, setServerSelected] = useState<IPlexServerInfo | null>(
    null
  );

  const servers = usePlexServers();

  const { get } = useAPI();

  const linkServer = () => {
    if (serverSelected) {
      get<IPlexConfig>(
        APIRoutes.GET_PLEX_SERVER(serverSelected.serverName)
      ).then((serverDetail) => {
        if (serverDetail.data && serverDetail.status === 200) {
          selectServer(serverDetail.data);
          onClose();
        }
      });
    }
  };

  const Server = ({ server }: PlexServerComponentProps) => {
    const _onChange = () => {
      setServerSelected(server);
    };

    return (
      <div className="level is-mobile">
        <div className="level-left is-pointed" onClick={_onChange}>
          <div className="level-item">
            <input
              type="radio"
              name={server.serverName}
              checked={
                serverSelected !== null &&
                server.serverName === serverSelected.serverName
              }
              onChange={_onChange}
              className="is-pointed"
            />
          </div>
          <div className="level-item has-text-grey-dark">
            {server.serverName}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={(e) => onClose()} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-weight-semibold">
            Plex servers
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={(e) => onClose()}
          />
        </header>
        <section className="modal-card-body">
          {servers.isLoading && <PrimarySpinner size={Sizes.LARGE} />}
          {!servers.isLoading &&
            servers.data &&
            servers.data.map((server) => {
              return <Server key={server.serverName} server={server} />;
            })}
        </section>
        <footer className="modal-card-foot">
          <PrimaryOutlinedButton type="button" onClick={() => linkServer()}>
            Save changes
          </PrimaryOutlinedButton>
        </footer>
      </div>
    </div>
  );
};

export { ServersModal };
