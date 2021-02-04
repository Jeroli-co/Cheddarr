import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.aside`
  min-width: 300px;
  background: ${(props) => props.theme.secondary};
`;

export const SidebarMenu = () => {
  return <SidebarContainer>hehe</SidebarContainer>;
};
