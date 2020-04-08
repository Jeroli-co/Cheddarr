import React from "react";
import styled from "styled-components";
import {Animate} from "../../../../animations/Animate";
import {FadeIn, FadeOut} from "../../../../animations/Animations";

const SubmitButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.primary};
  background-color: white;
  color: ${(props) => props.theme.primary};
  margin: 0 1em;
  padding: 0.25em 1em;
  font-size: 1em;
  width: 150px;
  height: 40px;
  
  &:hover {
    cursor: pointer;
    color: white;
    background-color: ${(props) => props.theme.primary};
  }
`;

const SubmitContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.primaryLight};
  background-color: ${(props) => props.theme.primaryLighter}; 
`;

const SubmitPlexConfig = ({ isFormDirty }) => {

  return (
    <Animate animationIn={FadeIn} animationOut={FadeOut} isVisible={isFormDirty} duration={0.3}>
      <SubmitContainer>
        <SubmitButton type="submit">
          Save changes
        </SubmitButton>
      </SubmitContainer>
    </Animate>
  );

};

export {
  SubmitPlexConfig
}