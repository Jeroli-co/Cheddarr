import React from "react";
import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";

const Container = styled.footer`
  height: ${STATIC_STYLES.FOOTER_HEIGHT}px;
  background: ${(props) => props.theme.primary};
`;

export const Footer = () => {
  return <Container />;
};
