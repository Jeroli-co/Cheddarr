import React from 'react';

const NotFound = () => {
	return (
		<div className="NotFound" data-testid="NotFound">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							404 ! Oops the resource has not been found...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

const InternalServeurError = () => {
	return (
		<div className="InternalServerError" data-testid="InternalServerError">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							500 ! Oops there was a internal server error...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

const Unauthorized = () => {
	return (
		<div className="Unauthorized" data-testid="Unauthorized">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							401 ! Oops you are unauthorized to load this resource...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

export {
	NotFound,
	InternalServeurError,
	Unauthorized
};

