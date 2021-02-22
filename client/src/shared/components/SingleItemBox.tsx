import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";

export const SingleItemBox = styled.div`
  width: 100%;
  border: 5px solid ${(props) => props.theme.primaryLighter};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.white};
  cursor: pointer;

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 260px;
    max-width: 260px;
    height: 120px;
    max-height: 120px;
    margin-left: 10px;
  }
`;
