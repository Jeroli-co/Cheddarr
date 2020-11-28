import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { routes } from "../../../../router/routes";
import {
  AuthContext,
  AuthContextDefaultImpl,
} from "../../../auth/contexts/AuthContext";
import { Navbar } from "../../Navbar";

const logo = require("../../../../assets/cheddarr-small.png");

test("UserDropdown always shows static elment", () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={AuthContextDefaultImpl}>
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);
  expect(getByTestId("UserProfileLink")).toBeInTheDocument();
  expect(getByTestId("UserSettingsLink")).toBeInTheDocument();
  expect(getByTestId("SignOutButton")).toBeInTheDocument();
});

test("UserDropdown shows user picture if it's set", () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={AuthContextDefaultImpl}>
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);
  expect(getByTestId("UserDropdownPicture")).toBeInTheDocument();
});

test("UserDropdown shows username if avatar is not set", () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const username = "Jerolico";
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={AuthContextDefaultImpl}>
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);
  const userDropdownUsername = getByTestId("UserDropdownUsername");
  expect(userDropdownUsername).toBeInTheDocument();
  expect(userDropdownUsername).toHaveTextContent(username);
});
