import * as React from "react";
import styled from "styled-components";

const logo = require("../../assets/plex.png");

const PlexButtonStyle = styled.button`
  background-color: ${(props) => props.theme.plex};
  color: LightGrey;
  border: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;
  min-width: 120px;
  font-size: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
  max-height: 45px;

  &:hover {
    color: white;
  }

  .plex-logo {
    width: 25px;
    height: auto;
    margin-right: 1em;
  }
`;

type PlexButtonProps = {
  onClick: () => void;
  text: string;
  width?: string;
};

const PlexButton = ({ onClick, text }: PlexButtonProps) => {
  return (
    <PlexButtonStyle type="button" onClick={() => onClick()}>
      <img className="plex-logo" src={logo} alt="Plex logo" />
      <p>{text}</p>
    </PlexButtonStyle>
  );
};

export {PlexButton};
