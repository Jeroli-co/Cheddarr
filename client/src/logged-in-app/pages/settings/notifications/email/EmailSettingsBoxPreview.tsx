import React, { useState } from "react";
import { ItemBox } from "../../../../../shared/components/ItemBox";
import { EditEmailSettingsModal } from "./EditEmailSettingsModal";
import { INotificationsConfig } from "../../../../../shared/models/INotificationsConfig";

type EmailSettingsBoxPreviewProps = {
  emailConfig: INotificationsConfig;
};

export const EmailSettingsBoxPreview = (
  props: EmailSettingsBoxPreviewProps
) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>Email</ItemBox>
      {isSettingsModalOpen && (
        <EditEmailSettingsModal
          closeModal={() => setIsSettingsModalOpen(false)}
          emailConfig={props.emailConfig}
        />
      )}
    </>
  );
};
