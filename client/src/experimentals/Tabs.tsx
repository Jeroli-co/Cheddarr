import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";

const TabsStyle = styled.div`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 1rem;
  overflow: hidden;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 10px;
`;

const TabStyle = styled.div<{ isActive: boolean }>`
  border-top: 1px solid
    ${(props) => (props.isActive ? props.theme.color : props.theme.bgColor)};
  border-left: 1px solid
    ${(props) => (props.isActive ? props.theme.color : props.theme.bgColor)};
  border-right: 1px solid
    ${(props) => (props.isActive ? props.theme.color : props.theme.bgColor)};
  border-bottom: 1px solid
    ${(props) => (props.isActive ? props.theme.bgColor : props.theme.color)};

  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 2rem;
  padding-right: 2rem;

  :hover {
    border-top: 1px solid ${(props) => props.theme.color};
    border-left: 1px solid ${(props) => props.theme.color};
    border-right: 1px solid ${(props) => props.theme.color};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

const TabSide = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color};
  width: 100%;
`;

type TabsProps = {
  tabs: string[];
  activeTab: string;
};

export const Tabs = ({ tabs, activeTab }: TabsProps) => {
  const history = useHistory();
  return (
    <TabsStyle>
      <TabSide />
      {tabs.map((tab, index) => {
        return (
          <TabStyle
            isActive={activeTab === tab}
            onClick={() =>
              history.push(routes.SETTINGS.url + "/" + tab.toLowerCase())
            }
            key={index}
          >
            {tab}
          </TabStyle>
        );
      })}
      <TabSide />
    </TabsStyle>
  );
};
