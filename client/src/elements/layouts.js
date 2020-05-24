import styled, { css } from "styled-components";

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "stretch")};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "auto")};

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
    ${(props) =>
      props.childMarginTop &&
      css`
        margin-top: ${props.childMarginTop};
      `};

    ${(props) =>
      props.childMarginLeft &&
      css`
        margin-left: ${props.childMarginLeft};
      `};

    ${(props) =>
      props.childMarginBottom &&
      css`
        margin-bottom: ${props.childMarginBottom};
      `};

    ${(props) =>
      props.childMarginRight &&
      css`
        margin-right: ${props.childMarginRight};
      `};

    ${(props) =>
      props.childMargin &&
      css`
        margin: ${props.childMargin};
      `};

    ${(props) =>
      props.childPaddingTop &&
      css`
        padding-top: ${props.childPaddingTop};
      `};

    ${(props) =>
      props.childPaddingLeft &&
      css`
        padding-left: ${props.childPaddingLeft};
      `};

    ${(props) =>
      props.childPaddingBottom &&
      css`
        padding-bottom: ${props.childPaddingBottom};
      `};

    ${(props) =>
      props.childPaddingRight &&
      css`
        padding-right: ${props.childPaddingRight};
      `};

    ${(props) =>
      props.childPadding &&
      css`
        padding: ${props.childPadding};
      `};
  }
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "stretch")};
  width: ${(props) => (props.width ? props.width : "100%")};
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
    ${(props) =>
      props.childMarginTop &&
      css`
        margin-top: ${props.childMarginTop};
      `};

    ${(props) =>
      props.childMarginLeft &&
      css`
        margin-left: ${props.childMarginLeft};
      `};

    ${(props) =>
      props.childMarginBottom &&
      css`
        margin-bottom: ${props.childMarginBottom};
      `};

    ${(props) =>
      props.childMarginRight &&
      css`
        margin-right: ${props.childMarginRight};
      `};

    ${(props) =>
      props.childMargin &&
      css`
        margin: ${props.childMargin};
      `};

    ${(props) =>
      props.childPaddingTop &&
      css`
        padding-top: ${props.childPaddingTop};
      `};

    ${(props) =>
      props.childPaddingLeft &&
      css`
        padding-left: ${props.childPaddingLeft};
      `};

    ${(props) =>
      props.childPaddingBottom &&
      css`
        padding-bottom: ${props.childPaddingBottom};
      `};

    ${(props) =>
      props.childPaddingRight &&
      css`
        padding-right: ${props.childPaddingRight};
      `};

    ${(props) =>
      props.childPadding &&
      css`
        padding: ${props.childPadding};
      `};
  }
`;

export { ColumnLayout, RowLayout };
