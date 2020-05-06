import styled from "styled-components";

const isEmpty = (s) => {
  return s.replace(/\s/g, "").length === 0;
};

const cutString = (string, nbChar) => {
  return string.slice(0, nbChar) + (string.length > nbChar ? "..." : "");
};

const Text = styled.p`
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "normal")};
`;

export { isEmpty, cutString, Text };
