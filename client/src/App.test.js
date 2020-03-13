import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from './App';
import {routes} from "./routes";

test('App router load components (not authentication needed) correctly', () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <App />
    </Router>
  );

  const wrapper = render(tree);

  // Render Navbar and Home page
  const navbar = wrapper.getByTestId('Navbar');
  const home = wrapper.getByTestId('Home');
  expect(navbar).toBeInTheDocument();
  expect(home).toBeInTheDocument();

  // Render sign in form
  history.push(routes.SIGN_IN.url);
  const signInForm = wrapper.getByTestId('SignInForm');
  expect(signInForm).toBeInTheDocument();

  // Render sign up form
  history.push(routes.SIGN_UP.url);
  const signUpForm = wrapper.getByTestId('SignUpForm');
  expect(signUpForm).toBeInTheDocument();

  // Render confirm account
  history.push(routes.CONFIRM_ACCOUNT.url('secret-token'));
  const confirmAccount = wrapper.getByTestId('ConfirmAccount');
  expect(confirmAccount).toBeInTheDocument();

  // Render wait account confirmation
  history.push(routes.WAIT_ACCOUNT_CONFIRMATION.url('test@test.com'));
  const waitEmailConfirmation = wrapper.getByTestId('WaitingAccountConfirmation');
  expect(waitEmailConfirmation).toBeInTheDocument();

  // Render reset password component
  history.push(routes.RESET_PASSWORD.url('secret-token'));
  const resetPasswordForm = wrapper.getByTestId('ResetPasswordForm');
  expect(resetPasswordForm).toBeInTheDocument();

  // Render authorize google
  history.push(routes.AUTHORIZE_GOOGLE.url);
  const authorizeGoogle = wrapper.getByTestId('AuthorizeGoogle');
  expect(authorizeGoogle).toBeInTheDocument();

  // Render authorize facebook
  history.push(routes.AUTHORIZE_FACEBOOK.url);
  const authorizeFacebook = wrapper.getByTestId('AuthorizeFacebook');
  expect(authorizeFacebook).toBeInTheDocument();

  // Render 404 not found
  history.push(routes.ERROR_404.url);
  const notFound = wrapper.getByTestId('NotFound');
  expect(notFound).toBeInTheDocument();

  // Render 500 internal server error
  history.push(routes.ERROR_500.url);
  const internalServerError = wrapper.getByTestId('InternalServerError');
  expect(internalServerError).toBeInTheDocument();

  // Render 401 unauthorized
  history.push(routes.ERROR_401.url);
  const unhautorized = wrapper.getByTestId('Unauthorized');
  expect(unhautorized).toBeInTheDocument();
});

test('Router fire 404 when th url is unknown', () => {
  const history = createMemoryHistory({ initialEntries: ["/really/bad/url"] });
  const tree = (
    <Router history={history}>
      <App />
    </Router>
  );

  const wrapper = render(tree);

  // Render Notfound
  const notfound = wrapper.getByTestId('NotFound');
  expect(notfound).toBeInTheDocument();
});