import React, { useState } from "react";
import { H1 } from "../../../../shared/components/Titles";
import {
  TabSide,
  TabsStyle,
  TabStyle,
} from "../../../../shared/components/layout/Tabs";
import { UsersConfirmed } from "./UsersConfirmed";
import { UsersPending } from "./UsersPending";
import { useRoleGuard } from "../../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../../shared/enums/Roles";

export const UsersSettings = () => {
  const tabs = [
    { label: "Confirmed", uri: "confirmed" },
    { label: "Pending", uri: "pending" },
  ];

  const [activeTab, setActiveTab] = useState<"confirmed" | "pending">(
    "confirmed"
  );

  useRoleGuard([Roles.MANAGE_USERS]);

  return (
    <>
      <H1>Manage users</H1>
      <br />
      <TabsStyle>
        <TabSide />
        {tabs.map((tab, index) => {
          return (
            <TabStyle
              isActive={activeTab === tab.uri}
              onClick={() =>
                setActiveTab(
                  activeTab === "confirmed" ? "pending" : "confirmed"
                )
              }
              key={index}
            >
              {tab.label}
            </TabStyle>
          );
        })}
        <TabSide />
      </TabsStyle>
      {activeTab === "confirmed" && <UsersConfirmed />}
      {activeTab === "pending" && <UsersPending />}
    </>
  );
};
