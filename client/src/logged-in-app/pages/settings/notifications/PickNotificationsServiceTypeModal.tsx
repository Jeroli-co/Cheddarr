import React, { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { Button, SecondaryButton } from "../../../../shared/components/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ItemBox } from "../../../../shared/components/ItemBox";
import { NotificationsServicesTypes } from "../../../../shared/enums/NotificationsServicesTypes";
import { IEmailConfig } from "../../../../shared/models/IEmailConfig";
import { EmailSettingsForm } from "./email/EmailSettingsForm";
import { useNotificationsServicesContext } from "../../../../shared/contexts/NotificationsServicesContext";

type PickNotificationsServiceTypeModalProps = {
  closeModal: () => void;
};

export const PickNotificationsServiceTypeModal = (
  props: PickNotificationsServiceTypeModalProps
) => {
  const [
    notificationsServiceTypePick,
    setNotificationsServiceTypePick,
  ] = useState<NotificationsServicesTypes | null>(null);

  const closeModal = () => {
    setNotificationsServiceTypePick(null);
    props.closeModal();
  };

  const { updateEmailConfig } = useNotificationsServicesContext();
  const formsMethods = useForm();

  const onAddEmailConfig: SubmitHandler<IEmailConfig> = (
    data: IEmailConfig
  ) => {
    updateEmailConfig(data).then((res) => {
      if (res.status === 200) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => closeModal()}>
      <header>
        {notificationsServiceTypePick &&
          notificationsServiceTypePick === NotificationsServicesTypes.EMAIL && (
            <H2>Add email smtp server</H2>
          )}
        {!notificationsServiceTypePick && (
          <H2>Choose a notifications service type</H2>
        )}
      </header>

      {!notificationsServiceTypePick && (
        <>
          <section>
            <ItemBox
              onClick={() =>
                setNotificationsServiceTypePick(
                  NotificationsServicesTypes.EMAIL
                )
              }
            >
              Email
            </ItemBox>
          </section>
          <footer>
            <Buttons>
              <Button type="button" onClick={() => closeModal()}>
                Cancel
              </Button>
            </Buttons>
          </footer>
        </>
      )}
      {notificationsServiceTypePick &&
        notificationsServiceTypePick === NotificationsServicesTypes.EMAIL && (
          <FormProvider {...formsMethods}>
            <form onSubmit={formsMethods.handleSubmit(onAddEmailConfig)}>
              <section>
                <EmailSettingsForm config={null} />
              </section>
              <footer>
                <Buttons>
                  <SecondaryButton type="submit">Save</SecondaryButton>
                  <Button type="button" onClick={() => closeModal()}>
                    Cancel
                  </Button>
                </Buttons>
              </footer>
            </form>
          </FormProvider>
        )}
    </Modal>
  );
};
