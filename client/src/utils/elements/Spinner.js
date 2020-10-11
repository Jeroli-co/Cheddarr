import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { withTheme } from "styled-components";

const Spinner = ({ color, size }) => {
  return (
    <div>
      <FontAwesomeIcon
        icon={faSpinner}
        color={color}
        pulse
        size={size ? size : "1x"}
      />
    </div>
  );
};

export { Spinner };
