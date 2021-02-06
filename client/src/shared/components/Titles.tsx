import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";

export const H1 = styled.h1`
  font-size: 20px;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 18px;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 16px;
  }
`;

export const H2 = styled.h2`
  font-size: 18px;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 16px;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 14px;
  }
`;

export const H3 = styled.h3`
  font-size: 16px;

  @media (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    font-size: 14px;
  }

  @media (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 12px;
  }
`;
