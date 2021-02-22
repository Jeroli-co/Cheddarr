import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../../enums/StaticStyles";

type InputFieldProps = {
  width?: string;
  withIcon?: boolean;
  isInline?: boolean;
};

export const InputField = styled.div<InputFieldProps>`
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 100%;
  }

  display: flex;
  flex-direction: ${(props) => (props.isInline ? "row" : "column")};
  margin: 8px 0;

  label {
    white-space: nowrap;
  }

  ${(props) =>
    props.isInline &&
    css`
      label {
        padding-right: 10px;
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
