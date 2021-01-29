import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled, { withTheme } from "styled-components";
import { Sizes } from "../enums/Sizes";

const PrimarySpinnerStyle = styled.div`
  color: ${(props) => props.theme.primary};
`;

const SecondarySpinnerStyle = styled.div`
  color: ${(props) => props.theme.secondary};
`;

type SpinnerProps = {
  color?: string;
  size?: any;
  theme?: any;
};

// TODO: kill
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

type SpinnerV2Props = {
  size?: Sizes;
};

const SpinnerV2 = (props: SpinnerV2Props) => {
  const getSize = () => {
    switch (props.size) {
      case Sizes.SMALL:
        return "1x";
      case Sizes.MEDIUM:
        return "lg";
      case Sizes.LARGE:
        return "2x";
      case Sizes.XLARGE:
        return "3x";
      default:
        return "1x";
    }
  };

  return <FontAwesomeIcon icon={faSpinner} pulse size={getSize()} />;
};

export const PrimarySpinner = (props: SpinnerV2Props) => {
  return (
    <PrimarySpinnerStyle>
      <SpinnerV2 {...props} />
    </PrimarySpinnerStyle>
  );
};

export const SecondarySpinner = (props: SpinnerV2Props) => {
  return (
    <SecondarySpinnerStyle>
      <SpinnerV2 {...props} />
    </SecondarySpinnerStyle>
  );
};

export default withTheme(Spinner);
