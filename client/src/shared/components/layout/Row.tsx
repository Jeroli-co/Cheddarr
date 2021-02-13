import styled, { css } from "styled-components";

type RowProps = {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between";
  alignItems?: "center";
  width?: string;
};

export const Row = styled.div<RowProps>`
  display: flex;
  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
  ${(props) =>
    props.alignItems &&
    css`
      align-items: ${props.alignItems};
    `}
  
  width: ${(props) => (props.width ? props.width : "100%")};
  flex-wrap: wrap;
`;
