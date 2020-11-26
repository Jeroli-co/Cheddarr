import React from "react";

type UnlinkServerModalProps = {
  onUnlink: () => void;
  onClose: () => void;
  machineName: string;
};

const UnlinkServerModal = ({
  onUnlink,
  onClose,
  machineName,
}: UnlinkServerModalProps) => {
  return (
    <div
      className="UnlinkServerModal modal is-active"
      data-testid="UnlinkServerModal"
    >
      <div className="modal-background" onClick={() => onClose()} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Unlink Plex Server</p>
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
              You are about to unlink <b>{machineName}</b> from Cheddarr.
            </p>
            <p>
              You will no longer see the content of this server on your hub.
            </p>
          </div>
        </section>

        <footer className="modal-card-foot">
          <button className="button is-danger" onClick={() => onUnlink()}>
            Unlink Server
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
