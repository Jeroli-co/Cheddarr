import React, { useState } from "react";
import { Modal } from "../../../../shared/components/layout/Modal";
import { H2 } from "../../../../shared/components/Titles";
import { Buttons } from "../../../../shared/components/layout/Buttons";
import { Button, SecondaryButton } from "../../../../shared/components/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MediaProvidersTypes } from "../../../../shared/enums/MediaProvidersTypes";
import { IRadarrConfig } from "../../../../shared/models/IRadarrConfig";
import { ISonarrConfig } from "../../../../shared/models/ISonarrConfig";
import { RadarrSettingsForm } from "./radarr/RadarrSettingsForm";
import { Row } from "../../../../shared/components/layout/Row";
import { SonarrSettingsForm } from "./sonarr/SonarrSettingsForm";
import { ItemBox } from "../../../../shared/components/ItemBox";
import { useSonarrConfigsContext } from "../../../../shared/contexts/SonarrConfigContext";
import { useRadarrConfigsContext } from "../../../../shared/contexts/RadarrConfigsContext";

type PickMediaProvidersTypeModalProps = {
  closeModal: () => void;
};

export const PickMediaProviderTypeModal = (
  props: PickMediaProvidersTypeModalProps
) => {
  const [
    mediaProvidersTypePick,
    setMediaProvidersTypePick,
  ] = useState<MediaProvidersTypes | null>(null);

  const closeModal = () => {
    setMediaProvidersTypePick(null);
    props.closeModal();
  };

  const formsMethods = useForm();
  const { createRadarrConfig } = useRadarrConfigsContext();
  const { createSonarrConfig } = useSonarrConfigsContext();

  const onAddRadarrSettings: SubmitHandler<IRadarrConfig> = (
    data: IRadarrConfig
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    createRadarrConfig(data).then((res) => {
      if (res.status === 201) {
        props.closeModal();
      }
    });
  };

  const onAddSonarrSettings: SubmitHandler<ISonarrConfig> = (
    data: ISonarrConfig
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    createSonarrConfig(data).then((res) => {
      if (res.status === 201) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => closeModal()}>
      <header>
        {mediaProvidersTypePick &&
          mediaProvidersTypePick === MediaProvidersTypes.RADARR && (
            <H2>Add Radarr configuration</H2>
          )}
        {mediaProvidersTypePick &&
          mediaProvidersTypePick === MediaProvidersTypes.SONARR && (
            <H2>Add Sonarr configuration</H2>
          )}
        {!mediaProvidersTypePick && <H2>Choose a media server type</H2>}
      </header>

      {!mediaProvidersTypePick && (
        <>
          <section>
            <Row justifyContent="space-around">
              <ItemBox
                onClick={() =>
                  setMediaProvidersTypePick(MediaProvidersTypes.RADARR)
                }
              >
                Radarr
              </ItemBox>
              <ItemBox
                onClick={() =>
                  setMediaProvidersTypePick(MediaProvidersTypes.SONARR)
                }
              >
                Sonarr
              </ItemBox>
            </Row>
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
      {mediaProvidersTypePick &&
        mediaProvidersTypePick === MediaProvidersTypes.RADARR && (
          <FormProvider {...formsMethods}>
            <form onSubmit={formsMethods.handleSubmit(onAddRadarrSettings)}>
              <section>
                <RadarrSettingsForm config={null} />
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
      {mediaProvidersTypePick &&
        mediaProvidersTypePick === MediaProvidersTypes.SONARR && (
          <FormProvider {...formsMethods}>
            <form onSubmit={formsMethods.handleSubmit(onAddSonarrSettings)}>
              <section>
                <SonarrSettingsForm config={null} />
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
