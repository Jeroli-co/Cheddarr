import styled, { css } from "styled-components";
import { OptionalMarginAndPaddingP } from "./optionalMarginAndPadding/OptionalMarginAndPaddingP";

type TextProps = {
  fontSize?: string;
  fontWeight?: string;
  lineClamp?: number;
  color?: string;
  whiteSpace?: string;
};

export const Text = styled(OptionalMarginAndPaddingP)<TextProps>`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "normal")};
  color: ${(props) => (props.color ? props.color : props.theme.color)};
  ${(props) =>
    props.fontSize !== undefined &&
    css`
      font-size: ${props.fontSize};
    `}
   ${(props) =>
     props.whiteSpace !== undefined &&
     css`
       white-space: ${props.whiteSpace};
     `}
  ${(props) =>
    props.lineClamp !== undefined &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${props.lineClamp};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;
