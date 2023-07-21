import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../routes";
import { PageLoader } from "../../shared/components/PageLoader";

const HomePage = React.lazy(() => import("../../shared/Home"));
const ProfilePage = React.lazy(
  () => import("../../logged-in-app/pages/user-profile/Profile"),
);
const UsersSettingsPage = React.lazy(
  () => import("../../logged-in-app/pages/settings/users/UsersSettings"),
);
const SettingsPage = React.lazy(
  () => import("../../logged-in-app/pages/settings/Settings"),
);
const MoviePage = React.lazy(
  () => import("../../shared/components/media/Movie"),
);
const SeriesPage = React.lazy(
  () => import("../../shared/components/media/Series"),
);
const SearchPage = React.lazy(() => import("../../logged-in-app/pages/Search"));
const RequestsPage = React.lazy(
  () => import("../../logged-in-app/pages/Requests"),
);
const NotFoundPage = React.lazy(
  () => import("../../shared/components/errors/NotFound"),
);

export const UserRouter = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index path={routes.HOME.url} element={<HomePage />} />
        <Route path={routes.PROFILE.url(":id?")} element={<ProfilePage />} />
        <Route path={routes.USERS.url} element={<UsersSettingsPage />} />
        <Route path={routes.SETTINGS.url} element={<SettingsPage />} />
        <Route path={routes.MOVIE.url(":id")} element={<MoviePage />} />
        <Route path={routes.SERIES.url(":id")} element={<SeriesPage />} />
        <Route
          path={routes.SEARCH.url(":type", ":title")}
          element={<SearchPage />}
        />
        <Route path={routes.REQUESTS.url} element={<RequestsPage />} />
        <Route element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};
