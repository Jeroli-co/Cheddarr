import * as React from "react";
import styled from "styled-components";
import { ComponentSizes } from "../enums/ComponentSizes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SpinnerStyle = styled.div`
  color: ${(props) => props.theme.white};
`;

type SpinnerProps = {
  size?: ComponentSizes;
};

export const Spinner = (props: SpinnerProps) => {
  const getSize = () => {
    switch (props.size) {
      case ComponentSizes.SMALL:
        return "xs";
      case ComponentSizes.MEDIUM:
        return "sm";
      case ComponentSizes.LARGE:
        return "lg";
      case ComponentSizes.XLARGE:
        return "2x";
      default:
        return "lg";
    }
  };
  return (
    <SpinnerStyle>
      <FontAwesomeIcon icon={faSpinner} pulse size={getSize()} />
    </SpinnerStyle>
  );
};
