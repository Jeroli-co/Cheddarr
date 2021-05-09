import React from "react";
import { useRoleGuard } from "../../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../../shared/enums/Roles";
import { H2 } from "../../../../shared/components/Titles";
import {
  PrimaryDivider,
  PrimaryLightDivider,
} from "../../../../shared/components/Divider";
import { useConfig } from "../../../../shared/hooks/useConfig";

export const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();

  useRoleGuard([Roles.ADMIN]);

  return (
    <>
      <H2>Users</H2>
      <PrimaryLightDivider />
      <div>TODO: Add default roles</div>
      <PrimaryDivider />
      <H2>General</H2>
      <PrimaryLightDivider />
      <div>TODO: Add log level</div>
    </>
  );
};
