import React from 'react';

const BadRequest = () => {
	return (
		<div className="BadRequest" data-testid="BadRequest">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							400 ! Oops bad request...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

export {
  BadRequest
}