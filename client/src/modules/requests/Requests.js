import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { routes } from "../../router/routes";
import { RequestsTabs } from "./elements/RequestsTabs";
import { Container } from "../../utils/elements/Container";

const Requests = (props) => {
  return (
    <Container padding="1%" minHeight="100vh">
      <RequestsTabs location={props.location} />
      <div className="is-divider" />
      <Switch>
        <Route
          exact
          path={[routes.REQUESTS.url, routes.REQUESTS_SENT.url]}
          component={routes.REQUESTS_SENT.component}
        />
        <Route
          exact
          path={routes.REQUESTS_RECEIVED.url}
          component={routes.REQUESTS_RECEIVED.component}
        />
        <Redirect to={routes.NOT_FOUND.url} />
      </Switch>
    </Container>
  );
};

export { Requests };