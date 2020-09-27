import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { withTheme } from "styled-components";

const Spinner = ({ color, size, theme }) => {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      color={theme[color]}
      pulse
      size={size ? size : "1x"}
    />
  );
};

export default withTheme(Spinner);
