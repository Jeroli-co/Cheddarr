import React, { useContext, useState } from "react";
import Spinner from "../../../../../../shared/components/Spinner";
import { IPlexServerInfo } from "../models/IPlexServerInfo";
import { PlexConfigContext } from "../../../../../contexts/PlexConfigContext";
import { usePlexServers } from "../../../../../hooks/usePlexServers";
import { useAPI } from "../../../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../../../shared/enums/APIRoutes";
import { IPlexConfig } from "../models/IPlexConfig";
import { useAlert } from "../../../../../../shared/contexts/AlertContext";

type PlexServerComponentProps = {
  server: IPlexServerInfo;
};

type ServersModalProps = {
  onClose: () => void;
};

const ServersModal = ({ onClose }: ServersModalProps) => {
  const [serverSelected, setServerSelected] = useState<IPlexServerInfo | null>(
    null
  );

  const servers = usePlexServers();

  const { addConfig } = useContext(PlexConfigContext);

  const { get, post } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const linkServer = () => {
    if (serverSelected) {
      get<IPlexServerInfo>(
        APIRoutes.GET_PLEX_SERVER(serverSelected.serverName)
      ).then((serverDetail) => {
        if (serverDetail.data && serverDetail.status === 200) {
          post<IPlexConfig>(
            APIRoutes.CREATE_PLEX_CONFIG,
            serverDetail.data
          ).then((res) => {
            if (res.data && res.status === 201) {
              addConfig(res.data);
              pushSuccess("Configuration created");
              onClose();
            } else {
              pushDanger("Cannot create config");
            }
          });
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
          <p className="modal-card-title has-text-primary has-text-weight-semibold">
            Plex servers
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={(e) => onClose()}
          />
        </header>
        <section className="modal-card-body">
          {!servers && <Spinner color="primary" size="2x" />}
          {servers.data &&
            servers.data.map((server) => {
              return <Server key={server.serverName} server={server} />;
            })}
        </section>
        <footer className="modal-card-foot">
          <button
            type="button"
            className="button is-primary is-inverted"
            onClick={() => linkServer()}
          >
            Save changes
          </button>
          <button type="button" className="button" onClick={(e) => onClose()}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export { ServersModal };
