import React, {useEffect, useState} from "react";
import {usePlexConfig} from "../../../../../hooks/usePlexConfig";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const ServersModal = ({ onClose }) => {

  const [serverSelected, setServerSelected] = useState(null);
  const { getPlexServers, servers, updatePlexServer } = usePlexConfig();

  useEffect(() => {
    getPlexServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkServer = () => {
    if (serverSelected) {
      updatePlexServer(serverSelected["machine_id"], serverSelected.name).then(res => { if (res) onClose() });
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
            <input type="radio"
                   name={server.name}
                   checked={serverSelected && server["machine_id"] === serverSelected["machine_id"]}
                   onChange={_onChange}
            />
          </div>
          <div className="level-item has-text-grey-dark">
            { server.name }
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-primary has-text-weight-semibold">Plex servers</p>
          <button className="delete" aria-label="close" onClick={onClose}/>
        </header>
        <section className="modal-card-body">
          { !servers && (
            <div className="content has-text-centered has-text-primary">
              <FontAwesomeIcon icon={faSpinner} pulse size="2x"/>
            </div>
          )}
          { servers && servers.map(server => { return <Server key={server.name} server={server}/> }) }
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary is-inverted" onClick={linkServer}>Save changes</button>
          <button type="button" className="button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export {
  ServersModal
}
