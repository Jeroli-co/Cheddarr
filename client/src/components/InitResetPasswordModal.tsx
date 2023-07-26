import React from "react";
import { useForm } from "react-hook-form";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FORM_DEFAULT_VALIDATOR } from "../shared/enums/FormDefaultValidators";
import { useAPI } from "../shared/hooks/useAPI";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { useAlert } from "../shared/contexts/AlertContext";
import { Modal } from "../shared/components/layout/Modal";
import { Input } from "../elements/Input";
import { Button, PrimaryButton } from "../shared/components/Button";
import { Icon } from "../shared/components/Icon";
import { Buttons } from "../shared/components/layout/Buttons";
import { H2 } from "../shared/components/Titles";
import { HelpDanger } from "../shared/components/Help";

type InitResetPasswordModalProps = {
  closeModal: () => void;
};

const InitResetPasswordModal = ({
  closeModal,
}: InitResetPasswordModalProps) => {
  const { register, handleSubmit, errors } = useForm<{ email: string }>();

  const { put } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const onSubmit = handleSubmit((data) => {
    put(APIRoutes.INIT_RESET_PASSWORD, data).then((res) => {
      if (res.status === 202) {
        pushSuccess("Reset password initiate, check your email");
        closeModal();
      } else if (res.status === 404) {
        pushDanger("Email doesn't exist");
      } else {
        pushDanger("Cannot reset password");
      }
    });
  });

  return (
    <Modal close={closeModal}>
      <header>
        <H2>Reset your password</H2>
      </header>
      <form onSubmit={onSubmit}>
        <section>
          <Input withIcon>
            <label>Email</label>
            <div className="with-left-icon">
              <input
                name="email"
                type="email"
                placeholder="Enter a valid email"
                ref={register({
                  required: true,
                  maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                  pattern: FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.value,
                })}
              />
              <span className="icon">
                <Icon icon={faEnvelope} />
              </span>
            </div>
          </Input>
          {errors["email"] && errors["email"].type === "required" && (
            <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
          )}
          {errors["email"] && errors["email"].type === "maxLength" && (
            <HelpDanger>{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</HelpDanger>
          )}
          {errors["email"] && errors["email"].type === "pattern" && (
            <HelpDanger>
              {FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.message}
            </HelpDanger>
          )}
        </section>
        <footer>
          <Buttons>
            <PrimaryButton type="submit">Reset password</PrimaryButton>
            <Button type="button" onClick={() => closeModal()}>
              Cancel
            </Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  );
};

export { InitResetPasswordModal };
