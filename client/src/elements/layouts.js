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
  border-bottom: ${(props) =>
    props.borderBottom ? props.borderBottom : "none"};

  margin-top: ${(props) =>
    props.marginTop ? props.marginTop : props.margin ? props.margin : "0"};
  margin-left: ${(props) =>
    props.marginLeft ? props.marginLeft : props.margin ? props.margin : "0"};
  margin-bottom: ${(props) =>
    props.marginBottom
      ? props.marginBottom
      : props.margin
      ? props.margin
      : "0"};
  margin-right: ${(props) =>
    props.marginRight ? props.marginRight : props.margin ? props.margin : "0"};

  > * {
    margin-top: ${(props) =>
      props.childMarginTop
        ? props.childMarginTop
        : props.childMargin
        ? props.childMargin
        : "0"};
    margin-left: ${(props) =>
      props.childMarginLeft
        ? props.childMarginLeft
        : props.childMargin
        ? props.childMargin
        : "0"};
    margin-bottom: ${(props) =>
      props.childMarginBottom
        ? props.childMarginBottom
        : props.childMargin
        ? props.childMargin
        : "0"};
    margin-right: ${(props) =>
      props.childMarginRight
        ? props.childMarginRight
        : props.childMargin
        ? props.childMargin
        : "0"};
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
