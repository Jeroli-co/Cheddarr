import React from "react";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { routes } from "../../router/routes";
import { Container } from "../../elements/Container";
import { MoviesSearchTab } from "./elements/MoviesSearchTab";
import { SeriesSearchTab } from "./elements/SeriesSearchTab";
import { MediaSearchTab } from "./elements/MediaSearchTab";

const SearchPage = () => {
  const { type } = useParams();
  return (
    <Container padding="1em">
      <Switch>
        <Route exact path={routes.SEARCH.url("")} component={MediaSearchTab} />
        <Route
          exact
          path={routes.SEARCH.url("movies")}
          component={MoviesSearchTab}
        />
        <Route
          exact
          path={routes.SEARCH.url("series")}
          component={SeriesSearchTab}
        />
        <Route render={() => <Redirect to={routes.NOT_FOUND.url} />} />
      </Switch>
    </Container>
  );
};

export { SearchPage };
