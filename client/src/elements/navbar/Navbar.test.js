import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../contexts/AuthContext";
import {Navbar} from "./Navbar";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {routes} from "../../router/routes";

test('Navbar shows buttons sign in and sign up when log out', () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ isAuthenticated: false }}>
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);
  expect(getByTestId("SignInButton")).toBeInTheDocument();
  expect(getByTestId("SignUpButton")).toBeInTheDocument();
});

test('Navbar shows button UserDropdown when log in', () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ isAuthenticated: true}}>
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);
  expect(getByTestId("UserDropdown")).toBeInTheDocument();
});

