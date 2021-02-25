import React, { useState } from "react";
import { IPlexSettings } from "../../../../../shared/models/IPlexSettings";
import { EditPlexSettingsModal } from "./EditPlexSettingsModal";
import { ItemBox } from "../../../../../shared/components/ItemBox";
import { isEmpty } from "../../../../../utils/strings";

type PlexSettingsBoxPreview = {
  plexSettings: IPlexSettings;
};

export const PlexSettingsBoxPreview = (props: PlexSettingsBoxPreview) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(props.plexSettings.name)
          ? props.plexSettings.serverName
          : props.plexSettings.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditPlexSettingsModal
          closeModal={() => setIsSettingsModalOpen(false)}
          plexSettings={props.plexSettings}
        />
      )}
    </>
  );
};
