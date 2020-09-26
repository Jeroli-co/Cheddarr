import React from "react";
import logo from "../../assets/plex.png";
import styled from "styled-components";

const PlexButtonStyle = styled.button`
  background-color: ${(props) => props.theme.darkPlex};
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

const PlexButton = ({ onClick, text }) => {
  return (
    <PlexButtonStyle type="button" onClick={() => onClick()}>
      <img className="plex-logo" src={logo} alt="Plex logo" />
      <p>{text}</p>
    </PlexButtonStyle>
  );
};

export { PlexButton };
