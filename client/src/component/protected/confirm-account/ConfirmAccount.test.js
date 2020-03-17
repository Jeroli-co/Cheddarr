import React from 'react';
import {cleanup, render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../../context/AuthContext";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {routes} from "../../../routes";
import {ConfirmAccount} from "./ConfirmAccount";

afterEach(cleanup);

test('Confirm account shows AccountConfirmed on 201', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_ACCOUNT.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmAccount: () => new Promise((resolve) => resolve(201)) }}>
        <ConfirmAccount/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const accountConfirmed = await waitForElement(() => getByTestId("AccountConfirmed"));
  expect(accountConfirmed).toBeInTheDocument();
});

test('Confirm account shows AlreadyConfirmed on 409', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_ACCOUNT.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmAccount: () => new Promise((resolve) => resolve(409)) }}>
        <ConfirmAccount/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const alreadyConfirmed = await waitForElement(() => getByTestId("AlreadyConfirmed"));
  expect(alreadyConfirmed).toBeInTheDocument();
});

test('Confirm account shows TokenExpired on 410', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_ACCOUNT.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmAccount: () => new Promise((resolve) => resolve(410)) }}>
        <ConfirmAccount/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const tokenExpired = await waitForElement(() => getByTestId("TokenExpired"));
  expect(tokenExpired).toBeInTheDocument();
});

test('Confirm account shows nothing on other code', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.CONFIRM_ACCOUNT.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ confirmAccount: () => new Promise((resolve) => resolve(3209)) }}>
        <ConfirmAccount/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const confirmAccount = await waitForElement(() => getByTestId("ConfirmAccount"));
  expect(confirmAccount.firstChild === null);
});
