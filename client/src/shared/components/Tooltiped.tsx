import React from "react";
import styled from "styled-components";

type TooltipProps = {
  text: string;
  children: any;
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  .tooltip-text {
    visibility: hidden;
    width: 120px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 1s;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;

    // BOTTOM
    top: 100%;
    left: 50%;
    margin-left: -60px;

    &:after {
      content: " ";
      position: absolute;
      bottom: 100%; /* At the top of the tooltip */
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
    }
  }

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

export const Tooltiped = ({ text, children }: TooltipProps) => {
  return (
    <TooltipContainer>
      <p className="tooltip-text">{text}</p>
      {children}
    </TooltipContainer>
  );
};
