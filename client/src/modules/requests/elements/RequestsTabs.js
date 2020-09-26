import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../router/routes";

const RequestsTabs = React.forwardRef((props, ref) => {
  const isActiveTab = (option) => props.location.pathname === option;

  return (
    <div ref={ref} className="tabs is-toggle is-fullwidth">
      <ul>
        <li
          className={
            isActiveTab(routes.REQUESTS.url) ||
            isActiveTab(routes.REQUESTS_SENT.url)
              ? "is-active"
              : ""
          }
        >
          <Link to={routes.REQUESTS_SENT.url}>
            <span>Sent</span>
          </Link>
        </li>
        <li
          className={
            isActiveTab(routes.REQUESTS_RECEIVED.url) ? "is-active" : ""
          }
        >
          <Link to={routes.REQUESTS_RECEIVED.url}>
            <span>Received</span>
          </Link>
        </li>
      </ul>
    </div>
  );
});

export { RequestsTabs };
