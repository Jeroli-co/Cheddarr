import React, { useState } from "react";
import { IMediaServerConfig } from "../../../../../shared/models/IMediaServerConfig";
import { EditPlexSettingsModal } from "./EditPlexSettingsModal";
import { ItemBox } from "../../../../../shared/components/ItemBox";
import { isEmpty } from "../../../../../utils/strings";

type PlexSettingsBoxPreviewProps = {
  plexSettings: IMediaServerConfig;
};

export const PlexSettingsBoxPreview = (props: PlexSettingsBoxPreviewProps) => {
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
