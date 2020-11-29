import React from "react";

type UnlinkAccountModalProps = {
  onUnlink: () => void;
  onClose: () => void;
};

const UnlinkAccountModal = ({ onUnlink, onClose }: UnlinkAccountModalProps) => {
  return (
    <div
      className="UnlinkAccountModal modal is-active"
      data-testid="UnlinkAccountModal"
    >
      <div className="modal-background" onClick={() => onClose()} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Unlink Plex Account</p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={() => onClose()}
          />
        </header>

        <section className="modal-card-body">
          <div className="content">
            <p>You are about to unlink your Plex account from Cheddarr.</p>
            <p>You will no longer have access to Plex related features.</p>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button className="button is-danger" onClick={() => onUnlink()}>
            Unlink Account
          </button>
          <button className="button" type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export { UnlinkAccountModal };
