import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";

export const Help = styled.p`
  color: ${(props) => props.theme.grey};
  font-size: 14px;
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 12px;
  }
`;

export const HelpDanger = styled(Help)`
  color: ${(props) => props.theme.danger};
`;

export const HelpLink = styled(Help)`
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.primaryLighter};
  }
`;
