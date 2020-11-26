import styled, { css } from "styled-components";

const TITLE_SIZES = {
  one: "36px",
  two: "28px",
};

const isEmpty = (s: string) => {
  return s.replace(/\s/g, "").length === 0;
};

type TextProps = {
  fontSize?: string;
  fontWeight?: string;
  lineClamp?: number;
};

const Text = styled.p<TextProps>`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "normal")};
  ${(props) =>
    props.fontSize !== undefined &&
    css`
      font-size: ${props.fontSize};
    `}
  ${(props) =>
    props.lineClamp !== undefined &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${props.lineClamp};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;

const isArrayOfStrings = (value: any): boolean => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

export { isEmpty, Text, TITLE_SIZES, isArrayOfStrings };
