import styled, { css } from "styled-components";

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "auto")};
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  width: 100%;

  > * {
    margin: 1%;
  }

  @media only screen and (max-width: 768px) {
    ${(props) =>
      props.justifyContentTablet &&
      css`
        justify-content: ${props.justifyContentTablet};
      `};

    ${(props) =>
      props.alignItemsTablet &&
      css`
        align-items: ${props.alignItemsTablet};
      `};
  }
`;

export { ColumnLayout, RowLayout };
