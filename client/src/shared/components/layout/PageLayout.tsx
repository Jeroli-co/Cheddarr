import styled from "styled-components";
import { STATIC_STYLES } from "../../enums/StaticStyles";

export const PageLayout = styled.div`
  padding: 20px;
  min-height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
  overflow-x: hidden;
`;
