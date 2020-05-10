import React from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faTv } from "@fortawesome/free-solid-svg-icons";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { routes } from "../../router/routes";
import { Container } from "../../elements/Container";
import { MoviesSearchTab } from "./elements/MoviesSearchTab";
import { SeriesSearchTab } from "./elements/SeriesSearchTab";

const SearchTabs = ({ type }) => {
  return (
    <div className="tabs is-fullwidth">
      <ul>
        <li className={type === "movies" ? "is-active" : ""}>
          <Link to={routes.SEARCH.url("movies")}>
            <span className="icon">
              <FontAwesomeIcon icon={faFilm} />
            </span>
            <span>Movies</span>
          </Link>
        </li>
        <li className={type === "series" ? "is-active" : ""}>
          <Link to={routes.SEARCH.url("series")}>
            <span className="icon">
              <FontAwesomeIcon icon={faTv} />
            </span>
            <span>Series</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

const SearchPage = () => {
  const { type } = useParams();
  return (
    <Container padding="1em">
      <SearchTabs type={type} />
      <Switch>
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
