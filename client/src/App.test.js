import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {cleanup, render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from './App';
import {routes} from "./routes";
import {AuthContext} from "./context/AuthContext";
import {HttpResponse} from "./model/HttpResponse";

afterEach(cleanup);

test('App router load components (no authentication needed) correctly', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{
        isAuthenticated: false,
        confirmEmail: () => new Promise((resolve) => resolve(new HttpResponse(200, ""))),
        checkResetPasswordToken: () => new Promise((resolve) => resolve(new HttpResponse(200, ""))),
        signIn: () => new Promise((resolve) => resolve(new HttpResponse(3000, "")))
      }}>
        <App />
      </AuthContext.Provider>
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

  // Render confirm email
  history.push(routes.CONFIRM_EMAIL.url('secret-token'));
  const confirmEmail = await waitForElement(() => wrapper.getByTestId('ConfirmEmail'));
  expect(confirmEmail).toBeInTheDocument();

  // Render wait account confirmation
  history.push(routes.WAIT_EMAIL_CONFIRMATION.url);
  const waitEmailConfirmation = wrapper.getByTestId('WaitingEmailConfirmation');
  expect(waitEmailConfirmation).toBeInTheDocument();

  // Render reset password component
  history.push(routes.RESET_PASSWORD.url('secret-token'));
  const resetPassword = await waitForElement(() => wrapper.getByTestId('ResetPassword'));
  expect(resetPassword).toBeInTheDocument();

  // Render authorize
  history.push(routes.AUTHORIZE.url);
  const authorize = await waitForElement(() => wrapper.getByTestId('Authorize'));
  expect(authorize).toBeInTheDocument();

  // Render Resend email confirmation
  history.push(routes.RESEND_EMAIL_CONFIRMATION.url);
  const resendEmailConfirmation = wrapper.getByTestId('ResendEmailConfirmationModal');
  expect(resendEmailConfirmation).toBeInTheDocument();

  // Render internal server error
  history.push(routes.INTERNAL_SERVER_ERROR.url);
  const internalServerError = wrapper.getByTestId('InternalServerError');
  expect(internalServerError).toBeInTheDocument();

  // Render bad request
  history.push(routes.BAD_REQUEST.url);
  const badRequest = wrapper.getByTestId('BadRequest');
  expect(badRequest).toBeInTheDocument();

  // Render 404 not found
  history.push(routes.NOT_FOUND.url);
  const notFound = wrapper.getByTestId('NotFound');
  expect(notFound).toBeInTheDocument();
});

test('App router load components (authentication needed) correctly', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.HOME.url] });
  const email = "jero@li.co";
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{
        isAuthenticated: true,
        getUserProfile: () => new Promise((resolve) => resolve(new HttpResponse(200, "", {email: email}))),
        getApiKey: () => new Promise((resolve) => resolve(new HttpResponse(200, "", {api_key: "TEST-API-KEY"}))),
      }}>
        <App />
      </AuthContext.Provider>
    </Router>
  );

  const wrapper = render(tree);

  // Render Navbar and Home page
  const navbar = wrapper.getByTestId('Navbar');
  const home = wrapper.getByTestId('Home');
  expect(navbar).toBeInTheDocument();
  expect(home).toBeInTheDocument();

  history.push(routes.USER_PROFILE.url);
  const userProfile = await waitForElement(() => wrapper.getByTestId('UserProfile'));
  expect(userProfile).toBeInTheDocument();

  history.push(routes.USER_SETTINGS.url);
  const userSettings = await waitForElement(() => wrapper.getByTestId('UserSettings'));
  expect(userSettings).toBeInTheDocument();

  history.push(routes.USER_SETTINGS_PROFILE.url);
  const userSettingsProfile = wrapper.getByTestId('UserSettingsProfile');
  expect(userSettingsProfile).toBeInTheDocument();

  history.push(routes.CHANGE_PASSWORD.url);
  const changePassword = wrapper.getByTestId('ChangePasswordModal');
  expect(changePassword).toBeInTheDocument();

  history.push(routes.CHANGE_USERNAME.url);
  const changeUsername = wrapper.getByTestId('ChangeUsernameModal');
  expect(changeUsername).toBeInTheDocument();

  history.push(routes.CHANGE_EMAIL.url);
  const changeEmail = wrapper.getByTestId('ChangeEmailModal');
  expect(changeEmail).toBeInTheDocument();

  history.push(routes.DELETE.url);
  const deleteModal = wrapper.getByTestId('DeleteAccountModal');
  expect(deleteModal).toBeInTheDocument();

  history.push(routes.USER_SETTINGS_CONFIGURATIONS.url);
  const userSettingsConfigurations = wrapper.getByTestId('UserSettingsConfigurations');
  expect(userSettingsConfigurations).toBeInTheDocument();
});

test('Router fire 404 when th url is unknown', () => {
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
  const notfound = wrapper.getByTestId('NotFound');
  expect(notfound).toBeInTheDocument();
});
