import styled from "styled-components";
import React from "react";

type MediaServerRadioProps = {
  serverName: string;
  isSelected: boolean;
  select: () => void;
};

export const MediaServerRadio = (props: MediaServerRadioProps) => {
  return (
    <ServerContainer onClick={() => props.select()}>
      <input
        type="radio"
        name={props.serverName}
        checked={props.isSelected}
        readOnly
      />
      <p>{props.serverName}</p>
    </ServerContainer>
  );
};

const ServerContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  input {
    cursor: pointer;
    margin-right: 20px;
  }
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;
