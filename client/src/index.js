import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {AuthContextWithRouterProvider} from "./contexts/AuthContext";
import {APIContextProvider} from "./contexts/APIContext";
import {NotificationContextProvider} from "./contexts/NotificationContext";

ReactDOM.render(
  <BrowserRouter>
    <NotificationContextProvider>
      <APIContextProvider>
        <AuthContextWithRouterProvider>
          <App />
        </AuthContextWithRouterProvider>
      </APIContextProvider>
    </NotificationContextProvider>
  </BrowserRouter>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
