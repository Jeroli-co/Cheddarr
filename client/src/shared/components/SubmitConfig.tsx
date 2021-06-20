import React from "react";
import styled from "styled-components";
import { FadeIn, FadeOut } from "./animations/Animations";
import { Animate } from "./animations/Animate";

const SubmitContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid ${(props) => props.theme.primaryLight};
  background-color: ${(props) => props.theme.bgColor};
  z-index: 10;
`;

const SubmitButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.primary};
  color: ${(props) => props.theme.primary};
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

type SubmitConfigProps = {
  isFormDirty: boolean;
};

const SubmitConfig = ({ isFormDirty }: SubmitConfigProps) => {
  return (
    <Animate
      animationIn={FadeIn}
      animationOut={FadeOut}
      isVisible={isFormDirty}
      duration={0.3}
      size={null}
      count={null}
    >
      <SubmitContainer>
        <SubmitButton type="submit">Save changes</SubmitButton>
      </SubmitContainer>
    </Animate>
  );
};

export { SubmitConfig };
