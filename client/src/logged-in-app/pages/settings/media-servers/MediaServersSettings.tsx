import React, { useState } from "react";
import { H1 } from "../../../../shared/components/Titles";
import { Row } from "../../../../shared/components/layout/Row";
import { usePlexConfig } from "../../../../shared/contexts/PlexConfigContext";
import { PlexSettingsBoxPreview } from "./plex/PlexSettingsBoxPreview";
import { AddItemBox } from "../../../../shared/components/ItemBox";
import { PickMediaServerTypeModal } from "./PickMediaServerTypeModal";

export const MediaServersSettings = () => {
  const [
    isPickMediaServersTypeModalOpen,
    setIsPickMediaServersTypeModalOpen,
  ] = useState(false);
  const { configs: plexSettingsList } = usePlexConfig();

  return (
    <div>
      <H1>Configure your media servers</H1>
      <br />
      <Row>
        <AddItemBox onClick={() => setIsPickMediaServersTypeModalOpen(true)} />
        {plexSettingsList.data &&
          plexSettingsList.data.map((plexSettings, index) => {
            return (
              <PlexSettingsBoxPreview key={index} plexSettings={plexSettings} />
            );
          })}
      </Row>
      {isPickMediaServersTypeModalOpen && (
        <PickMediaServerTypeModal
          closeModal={() => setIsPickMediaServersTypeModalOpen(false)}
        />
      )}
    </div>
  );
};
