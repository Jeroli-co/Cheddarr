import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { Sizes } from "../../enums/Sizes";

type ToggleSwitchProps = {
  checked: boolean;
  round?: boolean;
  color?: string;
  toggle: () => void;
  size?: Sizes;
};

type ToggleSwitchStyleProps = {
  color?: string;
  size: number;
};

const ToggleSwitchStyle = styled.label<ToggleSwitchStyleProps>`
  position: relative;
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size / 2}px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    margin: auto;
    content: "";
    height: calc(${(props) => props.size / 2}px - 8px);
    width: calc(${(props) => props.size / 2}px - 8px);
    left: 4px;
    top: 0;
    bottom: 0;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: ${(props) =>
      props.color ? props.color : props.theme.primary};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(${(props) => props.size / 2}px);
    -ms-transform: translateX(${(props) => props.size / 2}px);
    transform: translateX(${(props) => props.size / 2}px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;

export const ToggleSwitch = (props: ToggleSwitchProps) => {
  const calcSize = () => {
    switch (props.size) {
      case Sizes.SMALL:
        return 36;
      case Sizes.MEDIUM:
        return 48;
      case Sizes.LARGE:
        return 60;
      case Sizes.XLARGE:
        return 72;
      default:
        return 48;
    }
  };

  return (
    <ToggleSwitchStyle color={props.color} size={calcSize()}>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={() => props.toggle()}
      />
      <span className={classNames("slider", { round: props.round })} />
    </ToggleSwitchStyle>
  );
};
