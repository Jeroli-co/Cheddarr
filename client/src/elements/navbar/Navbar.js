import React, {useContext} from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '../../assets/cheddarr-small.png';
import { AuthContext } from "../../contexts/AuthContext";
import { SignUpButton } from "../../modules/auth/elements/SignUpButton";
import { SignInButton } from "../../modules/auth/elements/SignInButton";
import {UserDropdown} from "./user-dropdown/UserDropdown";

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
					<Link className="navbar-item" href="https://bulma.io" to="/">
						<img src={logo} alt="Chedarr" width="32" height="24"/>
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
					<div className="navbar-start">
						<Link className="navbar-item" to="/">
							Home
						</Link>
					</div>

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

