import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import React from "react";

const GitHubButtonStyle = styled.a`
  color: ${(props) => props.theme.dark};
  opacity: 0.7;
  transition: 0.3 ease;
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
