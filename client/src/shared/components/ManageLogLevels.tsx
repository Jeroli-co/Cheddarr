import React, { useState } from "react";
import { H3 } from "./Titles";
import { PrimaryButton } from "./Button";
import { LogLevels } from "../enums/LogLevels";

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
      <H3>Log level</H3>
      <br />
      <select onChange={(e) => onLogLevelChange(e.target.value as LogLevels)}>
        {Object.values(LogLevels).map((value) => (
          <option value={value} selected={logLevel === value}>
            {value}
          </option>
        ))}
      </select>
      <br />
      <br />
      <PrimaryButton type="button" onClick={() => onSave()}>
        Save
      </PrimaryButton>
    </div>
  );
};
