import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../../router/routes";
import { PageLoader } from "../../shared/components/PageLoader";

const HomePage = React.lazy(() => import("../../shared/Home"));
const ProfilePage = React.lazy(() => import("./profile"));
const UsersPage = React.lazy(() => import("./users"));
const SettingsPage = React.lazy(() => import("./settings"));
const MoviesPage = React.lazy(() => import("./movies"));
const SeriesPage = React.lazy(() => import("./series"));
const SearchPage = React.lazy(() => import("../../logged-in-app/pages/Search"));
const RequestsPage = React.lazy(() => import("./requests"));
const NotFoundPage = React.lazy(
  () => import("../../shared/components/errors/NotFound"),
);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="settings/*" element={<SettingsPage />} />
        <Route path="users/*" element={<UsersPage />} />
        <Route path="requests/*" element={<RequestsPage />} />
        <Route path="profile/:id?" element={<ProfilePage />} />
        <Route path="movies/:id" element={<MoviesPage />} />
        <Route
          path="series/:id/seasons?/:seasonNumber?/episodes?/:episodeNumber?"
          element={<SeriesPage />}
        />
        <Route
          path={routes.SEARCH.url(":type", ":title")}
          element={<SearchPage />}
        />
        <Route element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};
