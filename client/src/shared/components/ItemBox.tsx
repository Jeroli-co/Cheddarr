import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";
import { Icon } from "./Icon";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Spinner } from "./Spinner";

export const ItemBox = styled.div`
  width: 100%;
  border: 5px solid ${(props) => props.theme.primaryLighter};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.white};
  cursor: pointer;
  margin: 10px;

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 260px;
    max-width: 260px;
    height: 120px;
    max-height: 120px;
  }
`;

const AddItemBoxStyle = styled(ItemBox)`
  font-size: 4em;
  color: ${(props) => props.theme.primary};
  border-color: ${(props) => props.theme.primary};
  &:hover {
    color: ${(props) => props.theme.primaryLighter};
    border-color: ${(props) => props.theme.primaryLighter};
  }
`;

type ClickableItemBoxProps = {
  onClick: () => void;
};

export const AddItemBox = (props: ClickableItemBoxProps) => {
  return (
    <AddItemBoxStyle onClick={() => props.onClick()}>
      <Icon icon={faPlus} />
    </AddItemBoxStyle>
  );
};

export const SpinnerItemBox = () => {
  return (
    <ItemBox>
      <Spinner />
    </ItemBox>
  );
};
