import React from 'react';
import {render, cleanup, waitForElement,} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../../context/AuthContext";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {routes} from "../../../routes";
import {ResetPassword} from "./ResetPassword";
import {HttpResponse} from "../../../model/HttpResponse";

afterEach(cleanup);

test('Reset password shows TokenExpired on 410', async () => {

  const history = createMemoryHistory({ initialEntries: [routes.RESET_PASSWORD.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ checkResetPasswordToken: () => new Promise((resolve) => resolve(new HttpResponse(410, "")))}}>
        <ResetPassword/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const tokenExpired = await waitForElement(() => getByTestId("TokenExpired"));
  expect(tokenExpired).toBeInTheDocument();
});

test('Reset password shows AlreadyConfirmed on 403', async () => {

  const history = createMemoryHistory({ initialEntries: [routes.RESET_PASSWORD.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ checkResetPasswordToken: () => new Promise((resolve) => resolve(new HttpResponse(403, "")))}}>
        <ResetPassword/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const alreadyConfirmed = await waitForElement(() => getByTestId("AlreadyConfirmed"));
  expect(alreadyConfirmed).toBeInTheDocument();
});

test('Reset password shows ResetPasswordForm on 200', async () => {

  const history = createMemoryHistory({ initialEntries: [routes.RESET_PASSWORD.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ checkResetPasswordToken: () => new Promise((resolve) => resolve(new HttpResponse(200, "")))}}>
        <ResetPassword/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const resetPasswordForm = await waitForElement(() => getByTestId("ResetPasswordForm"));
  expect(resetPasswordForm).toBeInTheDocument();
});

test('Reset password shows nothing on other code', async () => {

  const history = createMemoryHistory({ initialEntries: [routes.RESET_PASSWORD.url('secret-token')] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{ checkResetPasswordToken: () => new Promise((resolve) => resolve(1043))}}>
        <ResetPassword/>
      </AuthContext.Provider>
    </Router>
  );

  const { getByTestId } = render(tree);

  const resetPassword = await waitForElement(() => getByTestId("ResetPassword"));
  expect(resetPassword.firstChild === null);
});
