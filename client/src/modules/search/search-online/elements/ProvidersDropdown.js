import React from "react";
import { Spinner } from "../../../../utils/elements/Spinner";

const ProvidersDropdown = ({ providers, handleChanges }) => {
  if (!providers) return <Spinner color="LightSlateGray" size="sm" />;
  if (providers.length === 0) return <p>No provider found</p>;
  return (
    <div className="select is-primary">
      <select onChange={handleChanges}>
        {providers.map((p, index) => (
          <option key={index} value={p}>
            {p.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ProvidersDropdown };
