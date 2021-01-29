import styled from "styled-components";

export const Hero = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  wrap: nowrap;
`;

export const PrimaryHero = styled(Hero)`
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.secondary};
  font-size: 2em;
  height: 20vh;
`;
