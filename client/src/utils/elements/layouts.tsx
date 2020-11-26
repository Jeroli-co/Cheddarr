import styled, { css } from "styled-components";

const ColumnLayout = styled.div<RowLayoutProps>`
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

type RowLayoutProps = {
  wrap?: string;
  justifyContent?: string;
  alignItems?: string;
  width?: string;
  height?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderRadius?: string;
  backgroundColor?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  childMargin?: string;
  childMarginTop?: string;
  childMarginBottom?: string;
  childMarginLeft?: string;
  childMarginRight?: string;
  childPadding?: string;
  childPaddingTop?: string;
  childPaddingBottom?: string;
  childPaddingLeft?: string;
  childPaddingRight?: string;
};

const RowLayout = styled.div<RowLayoutProps>`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "stretch")};
  width: ${(props) => (props.width ? props.width : "100%")};
  border-bottom: ${(props) =>
    props.border
      ? props.border
      : props.borderBottom
      ? props.borderBottom
      : "none"};
  border-top: ${(props) =>
    props.border ? props.border : props.borderTop ? props.borderTop : "none"};
  border-left: ${(props) =>
    props.border ? props.border : props.borderLeft ? props.borderLeft : "none"};
  border-right: ${(props) =>
    props.border
      ? props.border
      : props.borderRight
      ? props.borderRight
      : "none"};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};
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

const RowLayout2 = styled.div<RowLayoutProps>`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "stretch")};
  width: ${(props) => (props.width ? props.width : "auto")};
  border-bottom: ${(props) =>
    props.border
      ? props.border
      : props.borderBottom
      ? props.borderBottom
      : "none"};
  border-top: ${(props) =>
    props.border ? props.border : props.borderTop ? props.borderTop : "none"};
  border-left: ${(props) =>
    props.border ? props.border : props.borderLeft ? props.borderLeft : "none"};
  border-right: ${(props) =>
    props.border
      ? props.border
      : props.borderRight
      ? props.borderRight
      : "none"};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};
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
  }
`;

type RowElementProps = {
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  border?: string;
  borderRight?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
};

const RowElement = styled.div<RowElementProps>`
  flex: ${({ flexGrow, flexShrink, flexBasis }) =>
    (flexGrow ? flexGrow + " " : "0 ") +
    (flexShrink ? flexShrink + " " : "1 ") +
    (flexBasis ? flexBasis : "auto")};
  border-bottom: ${(props) =>
    props.border
      ? props.border
      : props.borderBottom
      ? props.borderBottom
      : "none"};
  border-top: ${(props) =>
    props.border ? props.border : props.borderTop ? props.borderTop : "none"};
  border-left: ${(props) =>
    props.border ? props.border : props.borderLeft ? props.borderLeft : "none"};
  border-right: ${(props) =>
    props.border
      ? props.border
      : props.borderRight
      ? props.borderRight
      : "none"};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};
`;

export { ColumnLayout, RowLayout, RowLayout2, RowElement };
