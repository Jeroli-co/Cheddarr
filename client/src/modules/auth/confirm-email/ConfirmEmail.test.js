import React from 'react';
import {cleanup, render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../../contexts/AuthContext";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {routes} from "../../../router/routes";
import {ConfirmEmail} from "./ConfirmEmail";
import {HttpResponseModel} from "../../../models/HttpResponseModel";

afterEach(cleanup);

test('Confirm account shows EmailConfirmed on 201', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_EMAIL.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmEmail: () => new Promise((resolve) => resolve(new HttpResponseModel(200, ""))) }}>
        <ConfirmEmail/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const emailConfirmed = await waitForElement(() => getByTestId("EmailConfirmed"));
  expect(emailConfirmed).toBeInTheDocument();
});

test('Confirm account shows AlreadyConfirmed on 403', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_EMAIL.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmEmail: () => new Promise((resolve) => resolve(new HttpResponseModel(403, ""))) }}>
        <ConfirmEmail/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const alreadyConfirmed = await waitForElement(() => getByTestId("AlreadyConfirmed"));
  expect(alreadyConfirmed).toBeInTheDocument();
});

test('Confirm account shows TokenExpired on 410', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_EMAIL.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmEmail: () => new Promise((resolve) => resolve(new HttpResponseModel(410, ""))) }}>
        <ConfirmEmail/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const tokenExpired = await waitForElement(() => getByTestId("TokenExpired"));
  expect(tokenExpired).toBeInTheDocument();
});

test('Confirm account shows nothing on other code', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_EMAIL.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmEmail: () => new Promise((resolve) => resolve(3209)) }}>
        <ConfirmEmail/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const confirmEmail = await waitForElement(() => getByTestId("ConfirmEmail"));
  expect(confirmEmail.firstChild === null);
});
