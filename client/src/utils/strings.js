import styled, { css } from "styled-components";

const TITLE_SIZES = {
  one: "36px",
  two: "28px",
};

const isEmpty = (s) => {
  return s.replace(/\s/g, "").length === 0;
};

const cutString = (string, nbChar) => {
  return string.slice(0, nbChar) + (string.length > nbChar ? "..." : "");
};

const Text = styled.p`
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "normal")};
  ${(props) =>
    props.lineClamp &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${props.lineClamp};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;

export { isEmpty, cutString, Text, TITLE_SIZES };
