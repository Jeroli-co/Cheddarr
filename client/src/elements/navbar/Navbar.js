import React, {useContext} from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '../../assets/cheddarr-small.png';
import { AuthContext } from "../../contexts/AuthContext";
import { SignUpButton } from "../../modules/auth/elements/SignUpButton";
import { SignInButton } from "../../modules/auth/elements/SignInButton";
import {UserDropdown} from "./user-dropdown/UserDropdown";
import styled, {keyframes} from "styled-components";

const NavbarLogoKeyframes = () => {
  return keyframes`
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(0deg);
    }
    60% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;
}

const NavbarLogoStyle = styled.div`
  animation-name: ${NavbarLogoKeyframes};
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`;

const Navbar = () => {

	const { isAuthenticated, isLoading } = useContext(AuthContext);

	const toggleBurgerMenu = () => {
		const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
		if (navbarBurgers.length === 1) {
			const elem = navbarBurgers[0];
			const targetName = elem.dataset.target;
			const targetElem = document.getElementById(targetName);
			elem.classList.toggle('is-active');
			targetElem.classList.toggle('is-active');
		}
	};

	return (
		<div className="Navbar" data-testid="Navbar">
			<nav className="navbar is-primary" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <NavbarLogoStyle>
              <img src={logo} alt="Chedarr" width="32" height="24"/>
            </NavbarLogoStyle>
          </Link>

					<div role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false"
							 onClick={toggleBurgerMenu}
							 data-target="navbarBasicExample">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</div>
				</div>

				<div id="navbarBasicExample" className="navbar-menu">

					<div className="navbar-end">

						<a className="navbar-item" href="https://github.com/Jeroli-co/Cheddarr"
							 target="_blank" rel="noopener noreferrer">
							<span className="icon">
								<FontAwesomeIcon icon={faGithub}/>
							</span>
						</a>

						{ !isLoading && isAuthenticated &&
              <UserDropdown/>
						}

            { !isLoading && !isAuthenticated &&
              <div className="navbar-item">
                <div className="buttons">
                  <SignInButton/>
                  <SignUpButton/>
                </div>
              </div>
            }

					</div>
				</div>
			</nav>
		</div>
	);
};

export {
	Navbar
};

