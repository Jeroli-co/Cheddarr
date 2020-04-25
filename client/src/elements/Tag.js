import React from "react";
import styled from "styled-components";

const TagColor = {
  SUCCESS: { color: "#006500", bgColor: "#bcffb7" },
  DANGER: { color: "#800000", bgColor: "#ff9290" },
  WARNING: { color: "#805500", bgColor: "#ffe8a3" },
  INFO: { color: "#4667ae", bgColor: "#d3e5ff" },
};

const TagStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 6px;
  padding-right: 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => props.type.color};
  background-color: ${(props) => props.type.bgColor};
`;

const Tag = ({ type, content }) => {
  return (
    <TagStyle type={type}>
      <p>{content}</p>
    </TagStyle>
  );
};

export { Tag, TagColor };
