import React, { useState } from "react";
import styled from "styled-components";
import { H2 } from "./Titles";
import { PrimaryButton } from "./Button";
import { LogLevels } from "../enums/LogLevels";

const LogLevelCheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  input {
    &:first-child {
      margin-right: 1em;
    }
  }
`;

type ManageLogLevelsProps = {
  defaultValue: LogLevels;
  onSave: (logLevel: LogLevels) => void;
};

export const ManageLogLevels = (props: ManageLogLevelsProps) => {
  const [logLevel, setLogLevel] = useState<LogLevels>(props.defaultValue);

  const onLogLevelChange = (ll: LogLevels) => {
    setLogLevel(ll);
  };

  const onSave = () => {
    props.onSave(logLevel);
  };

  return (
    <div>
      <H2>Log level</H2>
      <br />
      {Object.values(LogLevels).map((value) => (
        <LogLevelCheckboxContainer>
          <input
            type="checkbox"
            onChange={() => onLogLevelChange(value)}
            checked={logLevel === value}
          />
          <p>{value}</p>
        </LogLevelCheckboxContainer>
      ))}
      <br />
      <PrimaryButton type="button" onClick={() => onSave()}>
        Save
      </PrimaryButton>
    </div>
  );
};
