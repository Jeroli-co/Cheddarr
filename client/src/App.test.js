import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { App } from "./App";
import { routes } from "./router/routes";
import { AuthContext } from "./modules/auth/contexts/AuthContext";

afterEach(cleanup);

test("App router load components (no authentication needed) correctly", () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value="">
        <App />
      </AuthContext.Provider>
    </Router>
  );

  const wrapper = render(tree);

  // Render Navbar and Home page
  const navbar = wrapper.getByTestId("Navbar");
  const home = wrapper.getByTestId("Home");
  expect(navbar).toBeInTheDocument();
  expect(home).toBeInTheDocument();
});

test("Router fire 404 when th url is unknown", () => {
  const history = createMemoryHistory({ initialEntries: ["/really/bad/url"] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value="">
        <App />
      </AuthContext.Provider>
    </Router>
  );

  const wrapper = render(tree);

  // Render Notfound
  const notfound = wrapper.getByTestId("NotFound");
  expect(notfound).toBeInTheDocument();
});
