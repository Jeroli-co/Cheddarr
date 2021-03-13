import styled, { css } from "styled-components";
import { ComponentSizes } from "../enums/ComponentSizes";
import React from "react";
import { Icon } from "./Icon";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type ButtonStyleProps = {
  fontSize?: ComponentSizes;
  bgColor?: string;
  color?: string;
  borderColor?: string;
  width?: string;
};

export const LinkButton = styled.a<ButtonStyleProps>`
  margin: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  align-items: center;
  border-radius: 4px;
  box-shadow: none;
  display: flex;
  justify-content: center;
  height: 2.5em;
  line-height: 1.5;
  padding: calc(0.5em - 1px) calc(1.25em - 1px);
  position: relative;
  vertical-align: top;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px none #8c8c8c;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  background: ${(props) => (props.bgColor ? props.bgColor : props.theme.grey)};
  color: ${(props) => props.theme.white};

  &:focus {
    outline: none;
  }

  font-size: ${(props) => {
    switch (props.fontSize) {
      case ComponentSizes.SMALL:
        return ".75rem";
      case ComponentSizes.MEDIUM:
        return "1rem";
      case ComponentSizes.LARGE:
        return "1.25rem";
      case ComponentSizes.XLARGE:
        return "1.50rem";
      default:
        return "1rem";
    }
  }};

  ${(props) =>
    props.borderColor &&
    css`
      border: 1px solid ${props.borderColor};
    `}

  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `}
  
  .left-icon {
    padding-right: 10px;
  }

  .right-icon {
    padding-left: 10px;
  }
`;

export const Button = styled.button<ButtonStyleProps>`
  margin: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  align-items: center;
  border-radius: 4px;
  box-shadow: none;
  display: flex;
  justify-content: center;
  height: 2.5em;
  line-height: 1.5;
  padding: calc(0.5em - 1px) calc(1.25em - 1px);
  position: relative;
  vertical-align: top;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px none #8c8c8c;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  background: ${(props) => (props.bgColor ? props.bgColor : props.theme.grey)};
  color: ${(props) => props.theme.white};

  &:focus {
    outline: none;
  }

  font-size: ${(props) => {
    switch (props.fontSize) {
      case ComponentSizes.SMALL:
        return ".75rem";
      case ComponentSizes.MEDIUM:
        return "1rem";
      case ComponentSizes.LARGE:
        return "1.25rem";
      case ComponentSizes.XLARGE:
        return "1.50rem";
      default:
        return "1rem";
    }
  }};
  ${(props) =>
    props.borderColor &&
    css`
      border: 1px solid ${props.borderColor};
    `}
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `}
  .left-icon {
    padding-right: 10px;
  }

  .right-icon {
    padding-left: 10px;
  }
`;

export const RoundedButton = styled(Button)`
  border-radius: 290486px;
`;

export const PrimaryLinkButton = styled(LinkButton)`
  background: ${(props) => props.theme.primaryLighter};
  &:hover {
    color: ${(props) => props.theme.primaryLight};
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${(props) => props.theme.primaryLighter};
`;

export const PrimaryRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.primary};
`;

export const SecondaryButton = styled(Button)`
  background-color: ${(props) => props.theme.secondary};
`;

export const SecondaryRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.secondary};
`;

export const SuccessButton = styled(Button)`
  background-color: ${(props) => props.theme.success};
  font-size: 15px;
  width: 30px;
  height: 30px;
`;

export const DangerButton = styled(Button)`
  background-color: ${(props) => props.theme.danger};
  min-width: 50px;
  min-height: 40px;
`;

export const IconButton = styled(Button)`
  font-size: 15px;
  width: 30px;
  height: 30px;
`;

export const PrimaryIconButton = styled(IconButton)`
  background-color: ${(props) => props.theme.primaryLighter};
`;

export const OutlinePrimaryIconButton = styled(IconButton)`
  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.primaryLighter};
  border: 1px solid ${(props) => props.theme.primaryLighter};
`;

export const DangerIconButton = styled(IconButton)`
  background-color: ${(props) => props.theme.danger};
`;

export const SuccessIconButton = styled(IconButton)`
  background-color: ${(props) => props.theme.success};
`;

type PlayButtonProps = {
  webUrl: string;
};

export const PlayButton = (props: PlayButtonProps) => {
  return (
    <PrimaryLinkButton href={props.webUrl} target="_blank">
      <span className="left-icon">
        <Icon icon={faPlay} />
      </span>
      Play
    </PrimaryLinkButton>
  );
};
