import React from "react";
import { Modal } from "../../../../../../shared/components/Modal";
import { H2 } from "../../../../../../shared/components/Titles";
import { Buttons } from "../../../../../../shared/components/layout/Buttons";
import {
  Button,
  PrimaryButton,
} from "../../../../../../shared/components/Button";

type UnlinkServerModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  serverName: string;
  onUnlink: () => void;
};

const UnlinkServerModal = (props: UnlinkServerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} close={props.closeModal}>
      <header>
        <H2>Unlink Plex Server</H2>
      </header>

      <section>
        <p>
          You are about to unlink <b>{props.serverName}</b> from Cheddarr.
        </p>
        <p>You will no longer see the content of this server on your hub.</p>
      </section>

      <footer>
        <Buttons>
          <PrimaryButton onClick={() => props.onUnlink()}>
            Unlink Server
          </PrimaryButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};

export { UnlinkServerModal };
