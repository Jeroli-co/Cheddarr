import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../cheddarr-small.png';
import { signOut } from '../../service/auth/authService';
import './Navbar.css';

const apiUrl = '/api';

function Navbar() {

	function toggleBurgerMenu() {
		const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
		if (navbarBurgers.length === 1) {
			const elem = navbarBurgers[0];
			const targetName = elem.dataset.target;
			const targetElem = document.getElementById(targetName);
			elem.classList.toggle('is-active');
			targetElem.classList.toggle('is-active');
		}
	}

	return (
		<div className="Navbar">
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<Link className="navbar-item" href="https://bulma.io" to="/">
						<img src={logo} alt="Chedarr" width="32" height="24" />
					</Link>

					<div role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" onClick={toggleBurgerMenu}
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
						<div className="navbar-item">
							<div className="buttons">

								<a className="button is-rounded is-dark" href="https://github.com/Jeroli-co/Cheddarr" target="_blank" rel="noopener noreferrer">
									<span className="icon">
										<FontAwesomeIcon icon={faGithub} />
									</span>
									<span>GitHub</span>
								</a>

								<Link className="button is-rounded is-primary" to="/sign-up">
									<span className="icon">
										<FontAwesomeIcon icon={faUserPlus} />
									</span>
									<span>Sign up</span>
								</Link>

								<Link className="button is-rounded is-primary" to="/sign-in">
									<span className="icon">
										<FontAwesomeIcon icon={faSignInAlt} />
									</span>
									<span>Sign in</span>
								</Link>

								<Link className="button is-rounded is-primary" to="/" onClick={signOut}>
									<span className="icon">
										<FontAwesomeIcon icon={faSignOutAlt} />
									</span>
									<span>Sign out</span>
								</Link>

							</div>
						</div>
					</div>
				</div>
			</nav>
		</div >
	);
}

export default Navbar;

