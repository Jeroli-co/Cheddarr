import React from "react";
import { useLocation } from "react-router-dom";
import { createContext, useContext } from "react";
import { Tabs } from "../components/layout/Tabs";

export type Tab = {
  label: string;
  uri: string;
};

export const TabsContext = createContext({});

export const useTabs = () => useContext(TabsContext);

type TabsContextProviderProps = {
  url: string;
  tabs: Tab[];
  children: any;
};

export const TabsContextProvider = ({
  url,
  tabs,
  children,
}: TabsContextProviderProps) => {
  const location = useLocation();

  const isActiveTab = (uri: string) => {
    return (
      location.pathname === url + "/" + uri.toLowerCase() ||
      location.pathname === url + "/" + uri.toLowerCase() + "/"
    );
  };

  const getActiveTab = () => {
    const activeTab = tabs.find((t: Tab) => isActiveTab(t.uri));
    return activeTab ? activeTab : tabs[0];
  };

  return (
    <TabsContext.Provider value={{}}>
      <Tabs tabs={tabs} activeTab={getActiveTab()} url={url} />
      {children}
    </TabsContext.Provider>
  );
};
