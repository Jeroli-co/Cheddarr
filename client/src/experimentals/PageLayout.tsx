import styled from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";

export const PageLayout = styled.section`
  padding: 20px;
  min-height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
`;
