import React from "react";
import { Spinner } from "../../../elements/Spinner";

const ProvidersDropdown = ({ providers, handleChange }) => {
  return (
    <div className="select is-primary">
      <select name="friends-movies-provider" onChange={handleChange}>
        {!providers && <Spinner color="LightSlateGray" size="small" />}
        {providers &&
          providers.map((p, index) => (
            <option key={index} value={p}>
              {p.username}
            </option>
          ))}
      </select>
    </div>
  );
};

export { ProvidersDropdown };
