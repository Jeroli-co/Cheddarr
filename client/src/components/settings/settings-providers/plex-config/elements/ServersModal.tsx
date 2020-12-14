import React, { useContext, useEffect, useState } from "react";
import Spinner from "../../../../elements/Spinner";
import { PlexService } from "../../../../../services/PlexService";
import { IPlexServerInfo } from "../../../../../models/IPlexServerInfo";
import { PlexConfigContext } from "../../../../../contexts/plex-config/PlexConfigContext";

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
  const [servers, setServers] = useState<IPlexServerInfo[] | null>(null);

  const { addConfig } = useContext(PlexConfigContext);

  useEffect(() => {
    PlexService.GetPlexServers().then((res) => {
      if (res.error === null) setServers(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkServer = () => {
    if (serverSelected) {
      PlexService.GetPlexServer(serverSelected.serverName).then((res) => {
        if (res.error === null) {
          PlexService.AddPlexConfig(res.data).then((res2) => {
            if (res2.error === null) {
              addConfig(res2.data);
              onClose();
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
          {servers &&
            servers.map((server) => {
              return <Server key={server.serverName} server={server} />;
            })}
        </section>
        <footer className="modal-card-foot">
          <button
            type="button"
            className="button is-primary is-inverted"
            onClick={linkServer}
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
