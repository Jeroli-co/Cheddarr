import React, {useContext} from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {faCog, faSignOutAlt, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '../../assets/cheddarr-small.png';
import { AuthContext } from "../../context/AuthContext";
import { SignUpButton } from "../protected/element/sign-up-button/SignUpButton";
import { SignInButton } from "../protected/element/sign-in-button/SignInButton";
import {routes} from "../../routes";
import {faUser} from "@fortawesome/free-regular-svg-icons";

const Navbar = () => {

	const { signOut, isAuthenticated, username, userPicture } = useContext(AuthContext);

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

						{ isAuthenticated ? (
								<div className="navbar-item has-dropdown is-hoverable">
									{
										(	userPicture &&
											<div className="navbar-link is-pointed">
												<img src={userPicture} alt="userPicture"/>
											</div>
										) || (
											<div className="navbar-link is-pointed">
												<span className="icon">
													<FontAwesomeIcon icon={faUser}/>
												</span>
												<span>{username}</span>
											</div>
										)
									}

									<div className="navbar-dropdown is-right">

										<Link className="navbar-item" to={routes.USER_PROFILE.url(username)} data-testid="UserProfileLink">
											<span className="icon">
												<FontAwesomeIcon icon={faUserCircle}/>
											</span>
											<span>Profile</span>
										</Link>

										<Link className="navbar-item" to={routes.USER_SETTINGS.url} data-testid="UserSettingsLink">
											<span className="icon">
												<FontAwesomeIcon icon={faCog}/>
											</span>
											<span>Settings</span>
										</Link>

										<hr className="navbar-divider"/>

										<div className="navbar-item is-pointed" onClick={signOut} data-testid="SignOutButton">
											<span className="icon">
												<FontAwesomeIcon icon={faSignOutAlt}/>
											</span>
											<span>Sign out</span>
										</div>

									</div>

								</div>
							) : (
								<div className="navbar-item">
									<div className="buttons">
										<SignInButton/>
										<SignUpButton/>
									</div>
								</div>
							)
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

