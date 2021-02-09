import React from "react";
import styled from "styled-components";
import { Sizes } from "../enums/Sizes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SpinnerStyle = styled.div`
  color: ${(props) => props.theme.white};
`;

type SpinnerProps = {
  size?: Sizes;
};

export const Spinner = (props: SpinnerProps) => {
  const getSize = () => {
    switch (props.size) {
      case Sizes.SMALL:
        return "xs";
      case Sizes.MEDIUM:
        return "sm";
      case Sizes.LARGE:
        return "lg";
      case Sizes.XLARGE:
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
