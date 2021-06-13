import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import { Tab } from "../../contexts/TabsContext";

export const TabsStyle = styled.div`
  overflow: hidden;
  overflow-x: auto;
  user-select: none;
  display: flex;
  align-items: stretch;
  font-size: 1rem;
  white-space: nowrap;
  margin-bottom: 10px;
`;

export const TabSide = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.primaryLighter};
  width: 100%;
`;

export const TabStyle = styled.div<{ isActive: boolean }>`
  border-top: 1px solid
    ${(props) => (props.isActive ? props.theme.primaryLighter : "none")};
  border-left: 1px solid
    ${(props) => (props.isActive ? props.theme.primaryLighter : "none")};
  border-right: 1px solid
    ${(props) => (props.isActive ? props.theme.primaryLighter : "none")};
  border-bottom: 1px solid
    ${(props) => (props.isActive ? "none" : props.theme.primaryLighter)};

  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  padding: 0.75rem 2rem;
  width: 100%;
  display: flex;
  justify-content: center;

  :hover {
    ${(props) =>
      !props.isActive &&
      css`
        background: ${(props) => props.theme.primaryLight};
      `}

    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

type TabsProps = {
  tabs: Tab[];
  activeTab: Tab;
  url: string;
};

export const Tabs = ({ tabs, activeTab, url }: TabsProps) => {
  const history = useHistory();
  return (
    <TabsStyle>
      <TabSide />
      {tabs.map((tab, index) => {
        return (
          <TabStyle
            isActive={activeTab.uri === tab.uri}
            onClick={() => history.push(url + "/" + tab.uri.toLowerCase())}
            key={index}
          >
            {tab.label}
          </TabStyle>
        );
      })}
      <TabSide />
    </TabsStyle>
  );
};
