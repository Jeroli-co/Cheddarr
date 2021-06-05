import React from "react";
import { useRoleGuard } from "../../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../../shared/enums/Roles";
import { H2, H3 } from "../../../../shared/components/Titles";
import {
  PrimaryDivider,
  PrimaryLightDivider,
} from "../../../../shared/components/Divider";
import { useConfig } from "../../../../shared/hooks/useConfig";
import { RolesTree } from "../../../../shared/components/RolesTree";
import { useAlert } from "../../../../shared/contexts/AlertContext";
import { ManageLogLevels } from "../../../../shared/components/ManageLogLevels";
import { LogLevels } from "../../../../shared/enums/LogLevels";

export const GeneralSettings = () => {
  useRoleGuard([Roles.ADMIN]);

  const { config, updateConfig } = useConfig();
  const { pushSuccess } = useAlert();

  const onDefaultRolesSave = (roles: number) => {
    updateConfig({ defaultRoles: roles }).then((res) => {
      if (res.status === 200) {
        pushSuccess("Default roles updated");
      }
    });
  };

  const onLogLevelSave = (logLevel: LogLevels) => {
    updateConfig({ logLevel: logLevel }).then((res) => {
      if (res.status === 200) {
        pushSuccess("Log level updated");
      }
    });
  };

  return (
    <>
      <H2>Users</H2>
      <PrimaryLightDivider />
      <H3>Default user roles</H3>
      {config.data && config.data.defaultRoles && (
        <RolesTree
          defaultValue={config.data.defaultRoles}
          onSave={onDefaultRolesSave}
        />
      )}
      <PrimaryDivider />
      <H2>General</H2>
      <PrimaryLightDivider />
      {config.data && config.data.logLevel && (
        <ManageLogLevels
          defaultValue={config.data.logLevel}
          onSave={onLogLevelSave}
        />
      )}{" "}
    </>
  );
};
