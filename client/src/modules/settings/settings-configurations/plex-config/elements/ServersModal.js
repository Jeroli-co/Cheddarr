import React, { useContext, useEffect, useState } from "react";
import { PlexConfigContext } from "../../../../../contexts/PlexConfigContext";
import { Spinner } from "../../../../../elements/Spinner";

const ServersModal = ({ onClose }) => {
  const [serverSelected, setServerSelected] = useState(null);
  const { getPlexServers, updateConfig } = useContext(PlexConfigContext);
  const [servers, setServers] = useState(null);

  useEffect(() => {
    getPlexServers().then((data) => {
      if (data) setServers(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkServer = () => {
    if (serverSelected) {
      updateConfig({
        machine_name: serverSelected.name,
        machine_id: serverSelected.machine_id,
      }).then((res) => {
        if (res) onClose();
      });
    }
  };

  const Server = ({ server }) => {
    const _onChange = () => {
      setServerSelected(server);
    };

    return (
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <input
              type="radio"
              name={server.name}
              checked={serverSelected && server.name === serverSelected.name}
              onChange={_onChange}
            />
          </div>
          <div className="level-item has-text-grey-dark">{server.name}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-primary has-text-weight-semibold">
            Plex servers
          </p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body">
          {!servers && (
            <Spinner color="primary" size="2x" justifyContent="center" />
          )}
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
          <button type="button" className="button" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export { ServersModal };
