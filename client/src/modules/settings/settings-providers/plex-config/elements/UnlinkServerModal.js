import React from "react";

const UnlinkServerModal = ({ onUnlink, onClose, machineName }) => {
  return (
    <div
      className="UnlinkServerModal modal is-active"
      data-testid="UnlinkServerModal"
    >
      <div className="modal-background" onClick={() => onClose()} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Unlink plex server</p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={() => onClose()}
          />
        </header>

        <section className="modal-card-body">
          <div className="content">
            <p>
              You are about to unlink cheddarr from <b>{machineName}</b>
            </p>
            <p>Those feature(s) will no longer be usable</p>
            <ul>
              <li>Widgets media plex hub</li>
            </ul>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button className="button is-danger" onClick={() => onUnlink()}>
            Unlink server
          </button>
          <button className="button" type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export { UnlinkServerModal };
