import React from "react";
import { Modal } from "../../../../../shared/components/layout/Modal";
import { H2 } from "../../../../../shared/components/Titles";
import { IMediaServerConfig } from "../../../../../shared/models/IMediaServerConfig";
import { PlexSettingsForm } from "./PlexSettingsForm";
import { Buttons } from "../../../../../shared/components/layout/Buttons";
import {
  Button,
  DangerButton,
  SecondaryButton,
} from "../../../../../shared/components/Button";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { usePlexConfig } from "../../../../../shared/contexts/PlexConfigContext";
import { Row } from "../../../../../shared/components/layout/Row";

type EditPlexSettingsModalProps = {
  closeModal: () => void;
  plexSettings: IMediaServerConfig;
};

export const EditPlexSettingsModal = (props: EditPlexSettingsModalProps) => {
  const formsMethods = useForm();
  const { updateConfig, deleteConfig } = usePlexConfig();

  const onEditPlexSettings: SubmitHandler<IMediaServerConfig> = (
    data: IMediaServerConfig
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    let newConfig = { ...props.plexSettings, ...data };
    updateConfig(newConfig).then((res) => {
      if (res.status === 200) {
        props.closeModal();
      }
    });
  };

  const onDeletePlexConfig = () => {
    deleteConfig(props.plexSettings.id).then((res) => {
      if (res.status === 204) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit {props.plexSettings.serverName}</H2>
      </header>

      <FormProvider {...formsMethods}>
        <form onSubmit={formsMethods.handleSubmit(onEditPlexSettings)}>
          <section>
            <PlexSettingsForm config={props.plexSettings} />
          </section>

          <footer>
            <Row justifyContent="space-between" alignItems="center">
              <Buttons>
                <SecondaryButton type="submit">Save</SecondaryButton>
                <Button type="button" onClick={() => props.closeModal()}>
                  Cancel
                </Button>
              </Buttons>
              <DangerButton type="button" onClick={() => onDeletePlexConfig()}>
                Delete
              </DangerButton>
            </Row>
          </footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
