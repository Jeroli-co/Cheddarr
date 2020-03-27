import React from 'react';
import {cleanup, render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {routes} from "../../router/routes";
import { AuthContext } from "../../contexts/AuthContext";
import {Profile} from "./Profile";
import {HttpResponse} from "../../models/HttpResponse";
import logo from "../../assets/cheddarr.png";

afterEach(cleanup);

test('Profile always shows static element', async () => {
  const history = createMemoryHistory({ initialEntries: [routes.USER_PROFILE.url] });
  const username = "Jerolico";
  const email = "jero@li.co";
  const tree = (
    <Router history={history}>
      <AuthContext.Provider value={{
        isAuthenticated: true,
        getUserProfile: () => new Promise((resolve) => resolve(new HttpResponse(200, "", {email: email}))),
        changeUserPicture: () => {},
        username: username,
        userPicture: logo
      }}>
        <Profile/>
      </AuthContext.Provider>
    </Router>
  );
  const { getByTestId } = render(tree);

  const userProfileContainer = await waitForElement(() => getByTestId("UserProfileContainer"));
  expect(userProfileContainer).toBeInTheDocument();

  const userProfileImage = await waitForElement(() => getByTestId("UserProfileImage"));
  expect(userProfileImage).toBeInTheDocument();

  const userProfileUsername = await waitForElement(() => getByTestId("UserProfileUsername"));
  expect(userProfileUsername).toBeInTheDocument();
  expect(userProfileUsername).toHaveTextContent(username);

  const userProfileEmail = await waitForElement(() => getByTestId("UserProfileEmail"));
  expect(userProfileEmail).toBeInTheDocument();
  expect(userProfileEmail).toHaveTextContent(email);
});