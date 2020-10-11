import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { routes } from "../../router/routes";
import { RequestsTabs } from "./elements/RequestsTabs";
import { Container } from "../../utils/elements/Container";
import { H1 } from "../../utils/elements/titles";
import { FlexElement } from "../../utils/elements/layouts";

const Requests = (props) => {
  return (
    <Container padding="15px" minHeight="100vh">
      <FlexElement padding="15px">
        <H1>Requests Dashboards</H1>
      </FlexElement>
      <RequestsTabs location={props.location} />
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
