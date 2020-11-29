import styled from "styled-components";

const TagColor = {
  SUCCESS: { color: "#006500", bgColor: "#bcffb7" },
  DANGER: { color: "#800000", bgColor: "#ff9290" },
  WARNING: { color: "#805500", bgColor: "#ffe8a3" },
  INFO: { color: "#4667ae", bgColor: "#d3e5ff" },
  DARK: { color: "#525252", bgColor: "#e8e8e8" },
};

type TagProps = {
  type: {
    color: string;
    bgColor: string;
  };
};

const Tag = styled.p<TagProps>`
  display: table;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  color: ${(props) => props.type.color};
  background-color: ${(props) => props.type.bgColor};
`;

export { Tag, TagColor };
