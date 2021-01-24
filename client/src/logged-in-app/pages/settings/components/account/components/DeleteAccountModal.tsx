import React from "react";
import { useHistory } from "react-router";
import { useUserService } from "../../../../user-profile/hooks/useUserService";

const DeleteAccountModal = () => {
  const history = useHistory();

  const { deleteAccount } = useUserService();

  const onSubmit = () => {
    deleteAccount().then((res) => {
      if (res.status === 200) closeModal();
    });
  };

  const closeModal = () => {
    history.goBack();
  };

  return (
    <div
      className="DeleteAccountModal modal is-active"
      data-testid="DeleteAccountModal"
    >
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            Are you sure you want to delete your account ?
          </p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={closeModal}
          />
        </header>
        <footer className="modal-card-foot">
          <button
            className="button is-danger"
            type="button"
            onClick={() => onSubmit()}
          >
            Delete account
          </button>
          <button className="button" type="button" onClick={closeModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export { DeleteAccountModal };
