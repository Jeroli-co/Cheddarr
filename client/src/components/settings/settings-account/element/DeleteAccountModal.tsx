import * as React from "react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../../router/routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../../enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { UserService } from "../../../../services/UserService";
import { NotificationContext } from "../../../../contexts/notifications/NotificationContext";

const DeleteAccountModal = () => {
  const [error, setError] = useState("");
  const history = useHistory();
  const { pushSuccess } = useContext(NotificationContext);

  const onSubmit = () => {
    UserService.DeleteAccount().then((res) => {
      if (res.error === null) {
        pushSuccess("Your account has been deleted");
        history.push(routes.SIGN_UP.url);
      } else {
        setError(res.error);
      }
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
