import React, {useContext, useEffect, useState} from "react";
import {PlexConfigContext} from "../../../../../contexts/PlexConfigContext";

const ServersModal = ({ onClose }) => {

  const [serverSelected, setServerSelected] = useState(null);
  const { getPlexServers, servers, updateServer } = useContext(PlexConfigContext);

  useEffect(() => {
    getPlexServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkServer = () => {
    if (serverSelected) {
      updateServer(serverSelected.name).then(res => {
        if (res) {
          onClose();
        }
      });
    }
  };

  const Server = ({ server }) => {
    return (
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <input type="radio"
                   id={server.name}
                   checked={serverSelected && serverSelected.name === server.name}
                   onClick={() => setServerSelected(server)}
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
          <p className="modal-card-title">Modal title</p>
          <button className="delete" aria-label="close" onClick={onClose}/>
        </header>
        <section className="modal-card-body">
          { servers && servers.map(server => { return <Server key={server.name} server={server}/> }) }
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={linkServer}>Save changes</button>
          <button type="button" className="button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export {
  ServersModal
}