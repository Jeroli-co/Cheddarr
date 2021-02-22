import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../shared/enums/FormDefaultValidators";
import { useUserService } from "../../../../shared/hooks/useUserService";
import { Button, PrimaryButton } from "../../../../shared/components/Button";
import { Modal } from "../../../../shared/components/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { InputField } from "../../../../shared/components/inputs/InputField";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { HelpDanger } from "../../../../shared/components/Help";
import { Icon } from "../../../../shared/components/Icon";

type ChangeEmailModalProps = {
  closeModal: () => void;
};

const ChangeEmailModal = (props: ChangeEmailModalProps) => {
  const { register, handleSubmit, errors } = useForm<{ email: string }>();
  const { updateEmail } = useUserService();

  const onSubmit = async (data: { email: string }) => {
    updateEmail(data.email).then((res) => {
      if (res.status === 200) props.closeModal();
    });
  };

  return (
    <Modal close={props.closeModal}>
      <header>
        <H2>Change your email</H2>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <InputField withIcon>
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
          </InputField>
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
            <PrimaryButton type="submit">Change email</PrimaryButton>
            <Button type="button" onClick={() => props.closeModal()}>
              Cancel
            </Button>
          </Buttons>
        </footer>
      </form>
    </Modal>
  );
};

export { ChangeEmailModal };
