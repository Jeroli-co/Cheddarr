import styled from "styled-components";

const Image = styled.img`
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};
  border: ${(props) => (props.border ? props.border : "none")};
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
  cursor: ${(props) => (props.cursor ? props.cursor : "default")};

  &:hover {
    opacity: ${(props) => (props.hoverOpacity ? props.hoverOpacity : "1")};
  }
`;

export { Image };
