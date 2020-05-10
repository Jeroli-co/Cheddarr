import styled, { css } from "styled-components";

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) =>
    props.alignItems ? props.alignItems : "flex-start"};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "auto")};
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.width ? props.width : "100%")};
  border-bottom: ${(props) =>
    props.borderBottom ? props.borderBottom : "none"};
  border-top: ${(props) => (props.borderTop ? props.borderTop : "none")};
  background-color: ${(props) =>
    props.backgroundColor
      ? props.theme[props.backgroundColor]
        ? props.theme[props.backgroundColor]
        : props.backgroundColor
      : "transparent"};

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

  padding-top: ${(props) =>
    props.paddingTop ? props.paddingTop : props.padding ? props.padding : "0"};
  padding-left: ${(props) =>
    props.paddingLeft
      ? props.paddingLeft
      : props.padding
      ? props.padding
      : "0"};
  padding-bottom: ${(props) =>
    props.paddingBottom
      ? props.paddingBottom
      : props.padding
      ? props.padding
      : "0"};
  padding-right: ${(props) =>
    props.paddingRight
      ? props.paddingRight
      : props.padding
      ? props.padding
      : "0"};

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

    padding-top: ${(props) =>
      props.childPaddingTop
        ? props.childPaddingTop
        : props.childPadding
        ? props.childPadding
        : "0"};
    padding-left: ${(props) =>
      props.childPaddingLeft
        ? props.childPaddingLeft
        : props.childPadding
        ? props.childPadding
        : "0"};
    padding-bottom: ${(props) =>
      props.childPaddingBottom
        ? props.childPaddingBottom
        : props.childPadding
        ? props.childPadding
        : "0"};
    padding-right: ${(props) =>
      props.childPaddingRight
        ? props.childPaddingRight
        : props.childPadding
        ? props.childPadding
        : "0"};
  }

  ${(props) =>
    props.flexGrow &&
    props.flexGrow.forEach(
      (itemGrow, index) => css`
        &:nth-child(${index}) {
          flex-grow: ${itemGrow};
        }
      `
    )};
`;

export { ColumnLayout, RowLayout };
