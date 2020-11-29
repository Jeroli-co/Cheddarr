import * as React from "react";

const PageLoader = () => {
  return (
    <div className="PageLoader" data-testid="PageLoader">
      <div className="pageloader is-left-to-right is-active">
        <span className="title">Loading...</span>
      </div>
    </div>
  );
};

export { PageLoader };
