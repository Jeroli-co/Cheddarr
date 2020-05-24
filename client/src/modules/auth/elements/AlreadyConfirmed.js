import React from "react";

const AlreadyConfirmed = () => {
  return (
    <section
      className="AlreadyConfirmed hero is-primary is-bold is-fullheight-with-navbar"
      data-testid="AlreadyConfirmed"
    >
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Oops this is no longer available...</h1>
        </div>
      </div>
    </section>
  );
};

export { AlreadyConfirmed };
