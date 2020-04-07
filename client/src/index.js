import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {AuthContextWithRouterProvider} from "./contexts/AuthContext";
import {APIContextProvider} from "./contexts/APIContext";
import {NotificationContextProvider} from "./contexts/NotificationContext";
import {ProvidersContextProvider} from "./contexts/ProvidersContext";
import { ThemeProvider } from "styled-components";

const theme = {
  primary: "#f8813f",
  primaryLight: "#ffc5a6",
  primaryLighter: "#ffe3d4",
};

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <NotificationContextProvider>
        <APIContextProvider>
          <AuthContextWithRouterProvider>
            <ProvidersContextProvider>
              <App />
            </ProvidersContextProvider>
          </AuthContextWithRouterProvider>
        </APIContextProvider>
      </NotificationContextProvider>
    </ThemeProvider>
  </BrowserRouter>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
