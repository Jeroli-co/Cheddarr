import React from "react";
import styled from "styled-components";
import { Spin } from "../../shared/components/animations/Animations";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";

const logo = require("../../assets/cheddarr.png");

const HomeStyle = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px);
  font-size: calc(10px + 2vm);
  padding: 10px;

  .home-content {
    display: flex;
    flex-direction: column;

    .home-logo {
      height: 40vmin;
      pointer-events: none;
      align-self: center;
      @media (prefers-reduced-motion: no-preference) {
        animation: ${Spin} infinite 20s linear;
      }
    }

    .home-link {
      color: ${(props) => props.theme.primary};
    }
  }
`;

const Home = () => {
  return (
    <HomeStyle>
      <div className="home-content">
        <img src={logo} className="home-logo" alt="logo" />
        <a
          className="home-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          SIGN IN TO START USING CHEDDAR
        </a>
      </div>
    </HomeStyle>
  );
};

export { Home };
