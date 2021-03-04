import React from "react";
import { Modal } from "../../../../../shared/components/layout/Modal";
import { H2 } from "../../../../../shared/components/Titles";
import { Buttons } from "../../../../../shared/components/layout/Buttons";
import {
  Button,
  DangerButton,
  SecondaryButton,
} from "../../../../../shared/components/Button";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Row } from "../../../../../shared/components/layout/Row";
import { IEmailConfig } from "../../../../../shared/models/IEmailConfig";
import { INotificationsConfig } from "../../../../../shared/models/INotificationsConfig";
import { APIRoutes } from "../../../../../shared/enums/APIRoutes";
import { ERRORS_MESSAGE } from "../../../../../shared/enums/ErrorsMessage";
import { useAPI } from "../../../../../shared/hooks/useAPI";
import { useAlert } from "../../../../../shared/contexts/AlertContext";
import { EmailSettingsForm } from "./EmailSettingsForm";
import { useNotificationsServicesContext } from "../../../../../shared/contexts/NotificationsServicesContext";

type EditEmailSettingsModalProps = {
  closeModal: () => void;
  emailConfig: INotificationsConfig;
};

export const EditEmailSettingsModal = (props: EditEmailSettingsModalProps) => {
  const formsMethods = useForm();

  const { put } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();
  const { deleteEmailConfig } = useNotificationsServicesContext();

  const onEditEmailConfig: SubmitHandler<IEmailConfig> = (
    data: IEmailConfig
  ) => {
    const settings: INotificationsConfig = {
      enabled: data.enabled,
      settings: { ...data },
    };
    put(APIRoutes.PUT_EMAIL_SETTINGS, settings).then((res) => {
      if (res.status === 200) {
        pushSuccess("SMTP Server config updated");
        props.closeModal();
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit email smtp server</H2>
      </header>

      <FormProvider {...formsMethods}>
        <form onSubmit={formsMethods.handleSubmit(onEditEmailConfig)}>
          <section>
            <EmailSettingsForm config={props.emailConfig} />
          </section>

          <footer>
            <Row justifyContent="space-between" alignItems="center">
              <Buttons>
                <SecondaryButton type="submit">Save</SecondaryButton>
                <Button type="button" onClick={() => props.closeModal()}>
                  Cancel
                </Button>
              </Buttons>
              <DangerButton type="button" onClick={() => deleteEmailConfig()}>
                Delete
              </DangerButton>
            </Row>
          </footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
