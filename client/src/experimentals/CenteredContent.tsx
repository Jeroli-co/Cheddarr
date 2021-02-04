import styled, { css } from "styled-components";

export const CenteredContent = styled.section<{ height?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `};
`;
