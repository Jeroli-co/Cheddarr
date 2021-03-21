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
import { ISonarrConfig } from "../../../../../shared/models/ISonarrConfig";
import { SonarrSettingsForm } from "./SonarrSettingsForm";
import { useSonarrConfigsContext } from "../../../../../shared/contexts/SonarrConfigContext";

type EditSonarrSettingsModalProps = {
  closeModal: () => void;
  sonarrConfig: ISonarrConfig;
};

export const EditSonarrSettingsModal = (
  props: EditSonarrSettingsModalProps
) => {
  const formsMethods = useForm();
  const { updateSonarrConfig, deleteSonarrConfig } = useSonarrConfigsContext();

  const onEditSonarrSettings: SubmitHandler<ISonarrConfig> = (
    data: ISonarrConfig
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    let newConfig = { ...props.sonarrConfig, ...data };
    updateSonarrConfig(props.sonarrConfig.id, newConfig).then((res) => {
      if (res.status === 200) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => props.closeModal()}>
      <header>
        <H2>Edit {props.sonarrConfig.name}</H2>
      </header>

      <FormProvider {...formsMethods}>
        <form onSubmit={formsMethods.handleSubmit(onEditSonarrSettings)}>
          <section>
            <SonarrSettingsForm config={props.sonarrConfig} />
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
                onClick={() => deleteSonarrConfig(props.sonarrConfig.id)}
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
