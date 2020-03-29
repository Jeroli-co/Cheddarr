import React from 'react';

const NotFound = () => {
	return (
		<div className="NotFound hero is-primary is-bold is-fullheight-with-navbar" data-testid="NotFound">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						404 ! Oops the resource has not been found...
					</h1>
				</div>
			</div>
		</div>
	);
};

export {
  NotFound
}