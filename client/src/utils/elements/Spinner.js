import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Spinner = ({ color, size }) => {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      color={color}
      pulse
      size={size ? size : "1x"}
    />
  );
};

export { Spinner };
