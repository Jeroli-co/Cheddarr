import React from "react";
import { Modal } from "../../../../../../shared/components/Modal";
import { H2 } from "../../../../../../shared/components/Titles";
import {
  Button,
  DangerButton,
} from "../../../../../../shared/components/Button";
import { Buttons } from "../../../../../../shared/components/layout/Buttons";

type UnlinkAccountModalProps = {
  onUnlink: () => void;
  isOpen: boolean;
  closeModal: () => void;
};

const UnlinkAccountModal = (props: UnlinkAccountModalProps) => {
  return (
    <Modal isOpen={props.isOpen} close={props.closeModal}>
      <header>
        <H2>Unlink Plex Account</H2>
      </header>

      <section>
        <p>You are about to unlink your Plex account from Cheddarr.</p>
        <p>You will no longer have access to Plex related features.</p>
      </section>

      <footer>
        <Buttons>
          <DangerButton onClick={() => props.onUnlink()}>
            Unlink Account
          </DangerButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};

export { UnlinkAccountModal };
