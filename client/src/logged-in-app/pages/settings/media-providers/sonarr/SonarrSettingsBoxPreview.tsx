import React, { useState } from "react";
import { ISonarrConfig } from "../../../../../shared/models/ISonarrConfig";
import { EditSonarrSettingsModal } from "./EditSonarrSettingsModal";
import { ItemBox } from "../../../../../shared/components/ItemBox";
import { isEmpty } from "../../../../../utils/strings";

type SonarrSettingsBoxPreviewProps = {
  sonarrConfig: ISonarrConfig;
};

export const SonarrSettingsBoxPreview = (
  props: SonarrSettingsBoxPreviewProps
) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(props.sonarrConfig.name) ? "Sonarr" : props.sonarrConfig.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditSonarrSettingsModal
          closeModal={() => setIsSettingsModalOpen(false)}
          sonarrConfig={props.sonarrConfig}
        />
      )}
    </>
  );
};
