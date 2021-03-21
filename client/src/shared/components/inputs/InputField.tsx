import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../../enums/StaticStyles";

type InputFieldProps = {
  width?: string;
  withIcon?: boolean;
  isInline?: boolean;
  hidden?: boolean;
};

export const InputField = styled.div<InputFieldProps>`
  display: flex;
  flex-direction: ${(props) => (props.isInline ? "row" : "column")};
  margin: 8px 0;

  label {
    white-space: nowrap;
  }

  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 100%;
  }

  ${(props) =>
    props.hidden &&
    css`
      visibility: hidden;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
    `};

  ${(props) =>
    props.isInline &&
    css`
      align-items: center;
      label {
        &:first-child {
          padding-right: 10px;
        }
        &:not(:first-child) {
          padding-left: 10px;
        }
      }
    `};

  .with-left-icon {
    position: relative;

    .icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
    }
  }

  input[type="text"],
  input[type="password"],
  input[type="email"],
  input[type="number"],
  input[type="search"],
  select {
    width: 100%;
    padding: 12px 20px;
    display: inline-block;
    border: 3px solid ${(props) => props.theme.primaryLight};
    border-radius: 4px;
    box-sizing: border-box;
    background: ${(props) => props.theme.primary};
    opacity: 0.6;
    transition: opacity 0.3s ease;
    color: ${(props) => props.theme.white};

    ${(props) =>
      props.withIcon &&
      css`
        padding-left: 40px;
      `}

    &:focus {
      opacity: 1;
      outline: none;
    }

    &::placeholder {
      color: ${(props) => props.theme.white};
    }
  }
`;
