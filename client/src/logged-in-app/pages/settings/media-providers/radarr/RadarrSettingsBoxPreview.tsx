import React, { useState } from "react";
import { IRadarrConfig } from "../../../../../shared/models/IRadarrConfig";
import { EditRadarrSettingsModal } from "./EditRadarrSettingsModal";
import { ItemBox } from "../../../../../shared/components/ItemBox";
import { isEmpty } from "../../../../../utils/strings";

type RadarrSettingsBoxPreviewProps = {
  radarrConfig: IRadarrConfig;
};

export const RadarrSettingsBoxPreview = (
  props: RadarrSettingsBoxPreviewProps
) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(props.radarrConfig.name) ? "Radarr" : props.radarrConfig.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditRadarrSettingsModal
          closeModal={() => setIsSettingsModalOpen(false)}
          radarrConfig={props.radarrConfig}
        />
      )}
    </>
  );
};
