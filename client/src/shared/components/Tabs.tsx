import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";

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

const TabSide = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.primary};
  width: 100%;
`;

const TabStyle = styled.div<{ isActive: boolean }>`
  border-top: 1px solid
    ${(props) => (props.isActive ? props.theme.primary : props.theme.bgColor)};
  border-left: 1px solid
    ${(props) => (props.isActive ? props.theme.primary : props.theme.bgColor)};
  border-right: 1px solid
    ${(props) => (props.isActive ? props.theme.primary : props.theme.bgColor)};
  border-bottom: 1px solid
    ${(props) => (props.isActive ? props.theme.bgColor : props.theme.primary)};
  color: ${(props) => props.theme.primary};

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
        backdrop-filter: brightness(90%);
      `}

    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

type TabsProps = {
  tabs: string[];
  activeTab: string;
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
            isActive={activeTab === tab}
            onClick={() => history.push(url + "/" + tab.toLowerCase())}
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
