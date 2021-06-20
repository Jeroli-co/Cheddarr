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
import { IRadarrConfig } from "../../../../../shared/models/IRadarrConfig";
import { RadarrSettingsForm } from "./RadarrSettingsForm";
import { useRadarrConfigsContext } from "../../../../../shared/contexts/RadarrConfigsContext";

type EditRadarrSettingsModalProps = {
  closeModal: () => void;
  radarrConfig: IRadarrConfig;
};

export const EditRadarrSettingsModal = (
  props: EditRadarrSettingsModalProps
) => {
  const formsMethods = useForm();
  const { updateRadarrConfig, deleteRadarrConfig } = useRadarrConfigsContext();

  const onEditRadarrSettings: SubmitHandler<IRadarrConfig> = (
    data: IRadarrConfig
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    let newConfig = { ...props.radarrConfig, ...data };
    updateRadarrConfig(props.radarrConfig.id, newConfig).then((res) => {
      if (res.status === 200) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit {props.radarrConfig.name}</H2>
      </header>

      <FormProvider {...formsMethods}>
        <form onSubmit={formsMethods.handleSubmit(onEditRadarrSettings)}>
          <section>
            <RadarrSettingsForm config={props.radarrConfig} />
          </section>

          <footer>
            <Row justifyContent="space-between" alignItems="center">
              <Buttons>
                <SecondaryButton type="submit">Save</SecondaryButton>
                <Button type="button" onClick={() => props.closeModal()}>
                  Cancel
                </Button>
              </Buttons>
              <DangerButton
                type="button"
                onClick={() => deleteRadarrConfig(props.radarrConfig.id)}
              >
                Delete
              </DangerButton>
            </Row>
          </footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
