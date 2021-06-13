import { Modal } from "./layout/Modal";
import { H2 } from "./Titles";
import React from "react";
import { Buttons } from "./layout/Buttons";
import { Button, DangerButton } from "./Button";

type DeleteDataModalProps = {
  title: string;
  description?: string;
  action: () => void;
  actionLabel: string;
  closeModal: () => void;
};

export const DeleteDataModal = (props: DeleteDataModalProps) => {
  return (
    <Modal close={props.closeModal}>
      <header>
        <H2>{props.title}</H2>
      </header>
      {props.description && <section>{props.description}</section>}
      <footer>
        <Buttons>
          <DangerButton type="button" onClick={() => props.action()}>
            {props.actionLabel}
          </DangerButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};
