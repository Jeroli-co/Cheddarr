import { useState } from "react";
import { FullWidthTag } from "../../../shared/components/FullWidthTag";
import { H1 } from "../../../shared/components/Titles";
import { Row } from "../../../shared/components/layout/Row";
import { AddItemBox, SpinnerItemBox } from "../../../shared/components/ItemBox";
import { EmailSettingsBoxPreview } from "../../../logged-in-app/pages/settings/notifications/email/EmailSettingsBoxPreview";
import { PickNotificationsServiceTypeModal } from "../../../logged-in-app/pages/settings/notifications/PickNotificationsServiceTypeModal";
import { useNotificationsServicesContext } from "../../../shared/contexts/NotificationsServicesContext";
import { useRoleGuard } from "../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../shared/enums/Roles";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [
    isPickNotificationsServicesTypeModalOpen,
    setIsPickNotificationsServicesTypeModalOpen,
  ] = useState(false);

  const { emailConfig } = useNotificationsServicesContext();
  useRoleGuard([Roles.ADMIN]);

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
