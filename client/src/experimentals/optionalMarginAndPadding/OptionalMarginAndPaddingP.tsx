import styled from "styled-components";

type OptionalMarginAndPaddingProps = {
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

export const OptionalMarginAndPaddingP = styled.p<
  OptionalMarginAndPaddingProps
>`
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
`;
