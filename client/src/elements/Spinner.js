import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const SpinnerStyle = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: center;
  color: ${(props) =>
    props.color ? props.theme[props.color] : props.theme.dark};
`;

const Spinner = ({ color, size, justifyContent }) => {
  return (
    <SpinnerStyle color={color} justifyContent={justifyContent}>
      <FontAwesomeIcon icon={faSpinner} pulse size={size ? size : "1x"} />
    </SpinnerStyle>
  );
};

export { Spinner };
