import React from "react";

const AlreadyConfirmed = () => {
	return (
		<div className="AlreadyConfirmed" data-testid="AlreadyConfirmed">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Oops this email has been already confirmed...
						</h1>
					</div>
				</div>
			</section>
		</div>
	);
};

export {
  AlreadyConfirmed
}