import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const GitHubButtonStyle = styled.a`
  margin: 0;
  width: 50px;
  height: 50px;
  position: absolute;
  right: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.primaryLighter};
  opacity: 0.8;
  transition: opacity 0.5s ease;
  &:hover {
    opacity: 1;
  }
`;

const GitHubButton = () => {
  return (
    <GitHubButtonStyle
      href="https://github.com/Jeroli-co/Cheddarr"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faGithub} size="lg" />
    </GitHubButtonStyle>
  );
};

export { GitHubButton };
