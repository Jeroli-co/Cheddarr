import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { withTheme } from "styled-components";
import * as React from "react";

interface SpinnerProps {
  color?: string;
  size?: any;
  theme?: any;
}

const Spinner = (props: SpinnerProps) => {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      color={props.color ? props.theme[props.color] : "black"}
      pulse
      size={props.size ? props.size : "1x"}
    />
  );
};

export default withTheme(Spinner);
