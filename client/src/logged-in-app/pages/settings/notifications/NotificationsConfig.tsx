import React from "react";
import { EmailConfig } from "./Email";
import { FullWidthTag } from "../../../../shared/components/FullWidthTag";

export const NotificationsConfig = () => {
  return (
    <div>
      <FullWidthTag>More notifications systems are coming soon</FullWidthTag>
      <br />
      <EmailConfig />
    </div>
  );
};
