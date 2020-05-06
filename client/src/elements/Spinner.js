import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const SpinnerStyle = styled.div`
  display: flex;
  height: ${(props) => (props.height ? props.height : "auto")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) =>
    props.alignItems ? props.alignItems : "flex-start"};
  align-items: center;
  color: ${(props) =>
    props.color ? props.theme[props.color] : props.theme.dark};
  padding: ${(props) => (props.padding ? props.padding : "0")};
`;

const Spinner = ({
  padding,
  color,
  size,
  justifyContent,
  alignItems,
  height,
}) => {
  return (
    <SpinnerStyle
      padding={padding}
      color={color}
      justifyContent={justifyContent}
      alignItems={alignItems}
      height={height}
    >
      <FontAwesomeIcon icon={faSpinner} pulse size={size ? size : "1x"} />
    </SpinnerStyle>
  );
};

export { Spinner };
