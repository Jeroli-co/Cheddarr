import React from 'react';

const InternalServerError = () => {
	return (
		<div className="InternalServerError hero is-primary is-bold is-fullheight-with-navbar" data-testid="InternalServerError">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						500 ! Oops something wrong happened...
					</h1>
				</div>
			</div>
		</div>
	);
};

export {
  InternalServerError
}