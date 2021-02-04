import styled, { css } from "styled-components";
import { Sizes } from "../enums/Sizes";

type ButtonStyleProps = {
  fontSize?: Sizes;
  bgColor?: string;
  color?: string;
  borderColor?: string;
  width?: string;
};

export const Button = styled.button<ButtonStyleProps>`
  margin: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  align-items: center;
  border-radius: 4px;
  box-shadow: none;
  display: inline-flex;
  height: 2.5em;
  line-height: 1.5;
  padding: calc(.5em - 1px) calc(.75em - 1px);
  position: relative;
  vertical-align: top;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px none #8c8c8c;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  background: ${(props) =>
    props.bgColor ? props.bgColor : props.theme.bgColor};

  &:focus {
    outline: none;
  }

  font-size: ${(props) => {
    switch (props.fontSize) {
      case Sizes.SMALL:
        return ".75rem";
      case Sizes.MEDIUM:
        return "1rem";
      case Sizes.LARGE:
        return "1.25rem";
      case Sizes.XLARGE:
        return "1.50rem";
      default:
        return "1rem";
    }
  }};

  ${(props) =>
    props.color &&
    css`
      color: ${props.color};
    `}
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
  padding-left: calc(1em + 0.25em);
  padding-right: calc(1em + 0.25em);
`;

export const PrimaryButton = styled(Button)`
  background-color: ${(props) => props.theme.primary};
`;

export const PrimaryRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.primary};
`;

export const PrimaryOutlinedButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.primary};
  color: ${(props) => props.theme.primary};
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.primary};
  }
`;

export const PrimaryOutlinedRoundedButton = styled(RoundedButton)`
  border: 1px solid ${(props) => props.theme.primary};
  color: ${(props) => props.theme.primary};
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.primary};
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: ${(props) => props.theme.secondary};
`;

export const SecondaryRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.secondary};
`;

export const SecondaryOutlinedButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.secondary};
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.primary};
  }
`;

export const SecondaryOutlinedRoundedButton = styled(RoundedButton)`
  border: 1px solid ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.secondary};
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.primary};
  }
`;

export const SuccessButton = styled(Button)`
  background-color: ${(props) => props.theme.success};
  color: white;
  font-size: 15px;
  width: 30px;
  height: 30px;
`;

export const SuccessRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.success};
  color: white;
  min-width: 50px;
  min-height: 40px;
`;

export const SuccessOutlinedButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.success};
  color: ${(props) => props.theme.success};
  min-width: 50px;
  min-height: 40px;
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.success};
  }
`;

export const SuccessOutlinedRoundedButton = styled(RoundedButton)`
  border: 1px solid ${(props) => props.theme.success};
  color: ${(props) => props.theme.success};
  min-width: 50px;
  min-height: 40px;
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.success};
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${(props) => props.theme.danger};
  color: white;
  font-size: 15px;
  width: 30px;
  height: 30px;
`;

export const DangerRoundedButton = styled(RoundedButton)`
  background-color: ${(props) => props.theme.danger};
  color: white;
  min-width: 50px;
  min-height: 40px;
`;

export const DangerOutlinedButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.danger};
  color: ${(props) => props.theme.danger};
  min-width: 50px;
  min-height: 40px;
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.danger};
  }
`;

export const DangerOutlinedRoundedButton = styled(RoundedButton)`
  border: 1px solid ${(props) => props.theme.danger};
  color: ${(props) => props.theme.danger};
  min-width: 50px;
  min-height: 40px;
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.danger};
  }
`;
