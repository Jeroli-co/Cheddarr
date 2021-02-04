import React from "react";
import { useLocation } from "react-router-dom";
import { createContext, useContext } from "react";
import { Tabs } from "../components/Tabs";

export const TabsContext = createContext({});

export const useTabs = () => useContext(TabsContext);

export const TabsContextProvider = ({ url, tabs, children }: any) => {
  const location = useLocation();

  const isActiveTab = (uri: string) => {
    return (
      location.pathname === url + "/" + uri.toLowerCase() ||
      location.pathname === url + "/" + uri.toLowerCase() + "/"
    );
  };

  const getActiveTab = () => {
    const activeTab = tabs.find((t: string) => isActiveTab(t));
    return activeTab ? activeTab : tabs[0];
  };

  return (
    <TabsContext.Provider value={{}}>
      <Tabs tabs={tabs} activeTab={getActiveTab()} url={url} />
      {children}
    </TabsContext.Provider>
  );
};
