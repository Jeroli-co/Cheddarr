import React, { useState } from "react";
import { SingleItemBox } from "../../../../../shared/components/SingleItemBox";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { EditPlexSettingsModal } from "./EditPlexSettingsModal";

type PlexSettingsBoxPreview = {
  plexSettings: IPlexSettings;
};

export const PlexSettingsBoxPreview = (props: PlexSettingsBoxPreview) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  return (
    <SingleItemBox onClick={() => setIsSettingsModalOpen(true)}>
      {props.plexSettings.serverName}
      {isSettingsModalOpen && (
        <EditPlexSettingsModal
          closeModal={() => setIsSettingsModalOpen(false)}
          plexSettings={props.plexSettings}
        />
      )}
    </SingleItemBox>
  );
};
