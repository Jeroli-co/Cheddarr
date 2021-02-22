import React, { useContext, useState } from "react";
import { Modal } from "../../../../../shared/components/Modal";
import { H2 } from "../../../../../shared/components/Titles";
import { Buttons } from "../../../../../shared/components/layout/Buttons";
import {
  Button,
  SecondaryButton,
} from "../../../../../shared/components/Button";
import { SingleItemBox } from "../../../../../shared/components/SingleItemBox";
import { MediaServerTypes } from "../../../../../shared/enums/MediaServersTypes";
import { AddPlexSettings } from "../plex/AddPlexSettings";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { PlexConfigContext } from "../../../../../shared/contexts/PlexConfigContext";

type PickMediaServerTypeModalProps = {
  closeModal: () => void;
};

export const PickMediaServerTypeModal = (
  props: PickMediaServerTypeModalProps
) => {
  const [
    mediaServersTypePick,
    setMediaServersTypePick,
  ] = useState<MediaServerTypes | null>(null);

  const closeModal = () => {
    setMediaServersTypePick(null);
    props.closeModal();
  };

  const formsMethods = useForm();
  const { createConfig } = useContext(PlexConfigContext);

  const onAddPlexSettings: SubmitHandler<IPlexSettings> = (
    data: IPlexSettings
  ) => {
    if (data.port === "") {
      data.port = null;
    }

    createConfig(data).then((res) => {
      if (res.status === 201) {
        props.closeModal();
      }
    });
  };

  return (
    <Modal close={() => closeModal()}>
      <header>
        <H2>Choose a media server type</H2>
      </header>

      {!mediaServersTypePick && (
        <>
          <section>
            <SingleItemBox
              onClick={() => setMediaServersTypePick(MediaServerTypes.PLEX)}
            >
              Plex
            </SingleItemBox>
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
      {mediaServersTypePick && mediaServersTypePick === MediaServerTypes.PLEX && (
        <FormProvider {...formsMethods}>
          <form onSubmit={formsMethods.handleSubmit(onAddPlexSettings)}>
            <section>
              <AddPlexSettings closeModal={props.closeModal} />
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
