import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";

export const H1 = styled.h1`
  font-size: 3em;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 2.5em;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 2em;
  }
`;

export const H2 = styled.h2`
  font-size: 2.5em;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 2em;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 1.5em;
  }
`;

export const H3 = styled.h3`
  font-size: 2em;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 1.5em;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 1em;
  }
`;

export const H4 = styled.p`
  font-size: 1.5em;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 1em;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 0.5em;
  }
`;
