import styled from "styled-components";

type ContainerProps = {
  justifyContent?: string;
  alignItems?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  border?: string;
  borderRadius?: string;
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
};

const Container = styled.div<ContainerProps>`
  display: flex;
  text-align: ${(props) => (props.textAlign ? props.textAlign : "left")};
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "stretch")};
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  min-height: ${(props) => (props.minHeight ? props.minHeight : "0")};
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : "none")};
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
  border: ${(props) => (props.border ? props.border : "none")};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};
`;

export { Container };
