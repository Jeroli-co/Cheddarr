import React from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../shared/enums/FormDefaultValidators";
import {
  IChangePasswordModel,
  useUserService,
} from "../../../../shared/toRefactor/useUserService";
import { Button, PrimaryButton } from "../../../../shared/components/Button";
import { Modal } from "../../../../shared/components/layout/Modal";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { H2 } from "../../../../shared/components/Titles";
import { Input } from "../../../../elements/Input";
import { Icon } from "../../../../shared/components/Icon";
import { HelpDanger } from "../../../../shared/components/Help";
import { useAlert } from "../../../../shared/contexts/AlertContext";

type ChangePasswordModalProps = {
  closeModal: () => void;
  id: number;
};

const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const { register, handleSubmit, errors, watch } =
    useForm<IChangePasswordModel>();
  const { updateUserById } = useUserService();
  const { pushSuccess, pushDanger } = useAlert();

  const onSubmit = (data: IChangePasswordModel) => {
    updateUserById(props.id, { ...data }).then((res) => {
      if (res.status === 200) {
        pushSuccess("Password changed");
        props.closeModal();
      } else {
        pushDanger("Cannot update password");
      }
    });
  };

  return (
    <Modal close={props.closeModal}>
      <header>
        <H2>Change your password</H2>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          {/* OLD PASSWORD */}
          <Input withIcon>
            <label>Old password</label>
            <div className="with-left-icon">
              <input
                name="oldPassword"
                type="password"
                placeholder={"Enter your old password"}
                ref={register({
                  required: true,
                  pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                })}
              />
              <span className="icon">
                <Icon icon={faKey} />
              </span>
            </div>
          </Input>
          {errors["oldPassword"] &&
            errors["oldPassword"].type === "required" && (
              <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
            )}
          {errors["oldPassword"] &&
            errors["oldPassword"].type === "pattern" && (
              <HelpDanger>
                {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
              </HelpDanger>
            )}

          {/* NEW PASSWORD */}
          <Input withIcon>
            <label>New password</label>
            <div className="with-left-icon">
              <input
                name="newPassword"
                type="password"
                placeholder="Enter a strong password"
                ref={register({
                  required: true,
                  pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                })}
              />
              <span className="icon">
                <Icon icon={faKey} />
              </span>
            </div>
          </Input>
          {errors["newPassword"] &&
            errors["newPassword"].type === "required" && (
              <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
            )}
          {errors["newPassword"] &&
            errors["newPassword"].type === "pattern" && (
              <HelpDanger>
                {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
              </HelpDanger>
            )}

          {/* CONFIRM NEW PASSWORD */}
          <Input withIcon>
            <label>Confirm new password</label>
            <div className="with-left-icon">
              <input
                name="passwordConfirmation"
                type="password"
                placeholder="Confirm your new password"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return value === watch("newPassword");
                  },
                })}
              />
              <span className="icon">
                <Icon icon={faKey} />
              </span>
            </div>
          </Input>
          {errors.passwordConfirmation &&
            errors.passwordConfirmation.type === "required" && (
              <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
            )}
          {errors.passwordConfirmation &&
            errors.passwordConfirmation.type === "validate" && (
              <HelpDanger>
                {FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}
              </HelpDanger>
            )}
        </section>
        <footer>
          <Buttons>
            <PrimaryButton type="submit">Change password</PrimaryButton>
            <Button type="button" onClick={() => props.closeModal()}>
              Cancel
            </Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  );
};

export { ChangePasswordModal };
