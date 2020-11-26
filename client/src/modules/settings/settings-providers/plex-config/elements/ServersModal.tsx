import React, { useEffect, useState } from "react";
import Spinner from "../../../../../utils/elements/Spinner";
import { PlexService } from "../../../../media-servers/plex/services/PlexService";
import { IPlexServer } from "../../../../media-servers/plex/models/IPlexServer";

type PlexServerComponentProps = {
  server: IPlexServer;
};

type ServersModalProps = {
  onClose: () => void;
};

const ServersModal = ({ onClose }: ServersModalProps) => {
  const [serverSelected, setServerSelected] = useState<IPlexServer | null>(
    null
  );
  const [servers, setServers] = useState<IPlexServer[] | null>(null);

  useEffect(() => {
    PlexService.GetPlexServers().then((res) => {
      if (res.error === null) setServers(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkServer = () => {
    if (serverSelected) {
      PlexService.AddPlexServer({
        name: serverSelected.name,
        machineId: serverSelected.machineId,
      }).then((res) => {
        if (res.error === null) {
          if (servers) {
            servers.push(res.data);
          }
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
              name={server.name}
              checked={
                serverSelected !== null && server.name === serverSelected.name
              }
              onChange={_onChange}
              className="is-pointed"
            />
          </div>
          <div className="level-item has-text-grey-dark">{server.name}</div>
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
              return <Server key={server.name} server={server} />;
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
