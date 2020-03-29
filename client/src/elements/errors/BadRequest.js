import React from 'react';

const BadRequest = () => {
	return (
		<section className="BadRequest hero is-primary is-bold is-fullheight-with-navbar" data-testid="BadRequest">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						400 ! Oops bad request...
					</h1>
				</div>
			</div>
		</section>
	);
};

export {
  BadRequest
}