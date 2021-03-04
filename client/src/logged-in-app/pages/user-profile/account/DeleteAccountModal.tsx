import React from "react";
import { useUserService } from "../../../../shared/toRefactor/useUserService";
import { Modal } from "../../../../shared/components/layout/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { Button, DangerButton } from "../../../../shared/components/Button";

type DeleteAccountModalProps = {
  closeModal: () => void;
};

const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const { deleteAccount } = useUserService();

  const onSubmit = () => {
    deleteAccount().then((res) => {
      if (res.status === 200) props.closeModal();
    });
  };

  return (
    <Modal close={props.closeModal}>
      <header>
        <H2>Are you sure you want to delete your account ?</H2>
      </header>
      <footer>
        <Buttons>
          <DangerButton type="button" onClick={() => onSubmit()}>
            Delete account
          </DangerButton>
          <Button type="button" onClick={() => props.closeModal()}>
            Cancel
          </Button>
        </Buttons>
      </footer>
    </Modal>
  );
};

export { DeleteAccountModal };
