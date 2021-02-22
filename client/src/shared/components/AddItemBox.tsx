import React from "react";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";
import { Icon } from "./Icon";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 100%;
  border: 5px solid ${(props) => props.theme.primaryLight};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.primaryLight};
  cursor: pointer;
  font-size: 4em;
  margin-left: 10px;

  &:hover {
    color: ${(props) => props.theme.primaryLighter};
    border-color: ${(props) => props.theme.primaryLighter};
  }

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 260px;
    max-width: 260px;
    height: 120px;
    max-height: 120px;
  }
`;

type AddItemBoxProps = {
  onClick: () => void;
};

export const AddItemBox = (props: AddItemBoxProps) => {
  return (
    <Container onClick={() => props.onClick()}>
      <Icon icon={faPlus} />
    </Container>
  );
};
