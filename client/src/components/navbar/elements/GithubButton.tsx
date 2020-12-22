import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import * as React from "react";

const GitHubButtonStyle = styled.a`
  color: ${(props) => props.theme.darker};
  opacity: 0.8;
  transition: opacity 0.5 ease;
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
