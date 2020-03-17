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

export {
  NotFound
}