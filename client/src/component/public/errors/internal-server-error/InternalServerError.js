import React from 'react';

const InternalServerError = () => {
	return (
		<div className="InternalServerError" data-testid="InternalServerError">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							500 ! Oops something wrong happened...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

export {
  InternalServerError
}