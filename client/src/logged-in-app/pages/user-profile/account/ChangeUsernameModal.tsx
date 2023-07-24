import React from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../shared/enums/FormDefaultValidators";
import { useUserService } from "../../../../shared/toRefactor/useUserService";
import { Modal } from "../../../../shared/components/layout/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Input } from "../../../../shared/components/forms/inputs/Input";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { Button, PrimaryButton } from "../../../../shared/components/Button";
import { Icon } from "../../../../shared/components/Icon";
import { HelpDanger } from "../../../../shared/components/Help";

type ChangeUsernameModalProps = {
  closeModal: () => void;
  id: number;
};

const ChangeUsernameModal = (props: ChangeUsernameModalProps) => {
  const { register, handleSubmit, errors } = useForm<{ username: string }>();
  const { updateUserById } = useUserService();

  const onSubmit = handleSubmit((data) => {
    updateUserById(props.id, { username: data.username }).then((res) => {
      if (res.status === 200) props.closeModal();
    });
  });

  return (
    <Modal close={props.closeModal}>
      <header>
        <H2>Change your username</H2>
      </header>

      <form onSubmit={onSubmit}>
        <section>
          <Input withIcon>
            <label>New username</label>
            <div className="with-left-icon">
              <input
                name="username"
                type="text"
                placeholder="Enter your new username"
                ref={register({
                  required: true,
                  minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                  maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                  pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value,
                })}
              />
              <span className="icon">
                <Icon icon={faUser} />
              </span>
            </div>
          </Input>
          {errors["username"] && errors["username"].type === "required" && (
            <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
          )}
          {errors["username"] && errors["username"].type === "minLength" && (
            <HelpDanger>{FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}</HelpDanger>
          )}
          {errors["username"] && errors["username"].type === "maxLength" && (
            <HelpDanger>{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</HelpDanger>
          )}
          {errors["username"] && errors["username"].type === "pattern" && (
            <HelpDanger>
              {FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}
            </HelpDanger>
          )}
        </section>

        <footer>
          <Buttons>
            <PrimaryButton>Change username</PrimaryButton>
            <Button type="button" onClick={() => props.closeModal()}>
              Cancel
            </Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  );
};

export {ChangeUsernameModal};
