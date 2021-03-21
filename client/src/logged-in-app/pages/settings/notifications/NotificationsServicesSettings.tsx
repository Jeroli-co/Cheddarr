import React, { useState } from "react";
import { FullWidthTag } from "../../../../shared/components/FullWidthTag";
import { H1 } from "../../../../shared/components/Titles";
import { Row } from "../../../../shared/components/layout/Row";
import {
  AddItemBox,
  SpinnerItemBox,
} from "../../../../shared/components/ItemBox";
import { EmailSettingsBoxPreview } from "./email/EmailSettingsBoxPreview";
import { PickNotificationsServiceTypeModal } from "./PickNotificationsServiceTypeModal";
import { useNotificationsServicesContext } from "../../../../shared/contexts/NotificationsServicesContext";

export const NotificationsServicesSettings = () => {
  const [
    isPickNotificationsServicesTypeModalOpen,
    setIsPickNotificationsServicesTypeModalOpen,
  ] = useState(false);

  const { emailConfig } = useNotificationsServicesContext();

  return (
    <div>
      <FullWidthTag>More notifications systems are coming soon</FullWidthTag>
      <br />
      <H1>Configure your notifications service</H1>
      <br />
      <Row>
        <AddItemBox
          onClick={() => setIsPickNotificationsServicesTypeModalOpen(true)}
        />
        {emailConfig.isLoading && <SpinnerItemBox />}
        {!emailConfig.isLoading && emailConfig.data && (
          <EmailSettingsBoxPreview emailConfig={emailConfig.data} />
        )}
      </Row>
      {isPickNotificationsServicesTypeModalOpen && (
        <PickNotificationsServiceTypeModal
          closeModal={() => setIsPickNotificationsServicesTypeModalOpen(false)}
        />
      )}
    </div>
  );
};
