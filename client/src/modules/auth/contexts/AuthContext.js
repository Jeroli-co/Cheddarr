import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useApi } from "../../api/hooks/useApi";
import { routes } from "../../../router/routes";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";

const AuthContext = createContext();

const initialSessionState = {
  isAuthenticated: false,
  username: null,
  avatar: null,
  isLoading: true,
};

const AuthContextProvider = (props) => {
  const [session, setSession] = useState(initialSessionState);
  const { executeRequest, methods } = useApi();
  const { pushDanger } = useContext(NotificationContext);

  useEffect(() => {
    if (props.location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
      confirmSignInWithPlex(props.location.search).then((res) => {
        if (res) {
          let redirectURI = res.headers["redirect-uri"];
          redirectURI =
            redirectURI && redirectURI.length > 0
              ? redirectURI
              : routes.HOME.url;
          props.history.push(redirectURI);
        }
      });
      return;
    }

    if (session.isLoading) {
      const authenticated = Cookies.get("authenticated");
      const username = Cookies.get("username");
      const avatar = Cookies.get("avatar");
      if (authenticated === "yes") {
        initSession(username, avatar);
      } else {
        setSession({ ...initialSessionState, isLoading: false });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initSession = (username, avatar) => {
    Cookies.set("authenticated", "yes", { expires: 365 });
    Cookies.set("username", username, { expires: 365 });
    Cookies.set("avatar", avatar, { expires: 365 });
    setSession({
      ...session,
      isAuthenticated: true,
      username: username,
      avatar: avatar,
      isLoading: false,
    });
  };

  const clearSession = () => {
    Cookies.remove("authenticated");
    Cookies.remove("username");
    Cookies.remove("avatar");
    setSession({ ...initialSessionState, isLoading: false });
  };

  const signIn = async (data, redirectURI) => {
    const username = data["usernameOrEmail"] || data["username"];
    const fd = new FormData();
    fd.append("usernameOrEmail", username);
    fd.append("password", data["password"]);
    const remember = data["remember"];
    if (typeof remember !== "undefined" && remember !== null) {
      fd.append("remember", remember);
    }
    const res = await executeRequest(methods.POST, "/sign-in/", fd);

    switch (res.status) {
      case 200:
        initSession(res.data.username, res.data["avatar"]);
        props.history.push(redirectURI);
        return res;
      case 400:
      case 401:
        pushDanger(res.message);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const signInWithPlex = async (redirectURI) => {
    const res = await executeRequest(methods.GET, "/sign-in/plex/");
    switch (res.status) {
      case 200:
        const plexRes = await axios.post(res.data, {
          headers: { Accept: "application/json" },
        });
        switch (plexRes.status) {
          case 201:
            const key = plexRes.data["id"];
            const code = plexRes.data["code"];
            const authRes = await authorizePlex(key, code, redirectURI);
            if (authRes && authRes.status === 200) {
              window.location.href = authRes.headers.location;
            }
            return plexRes;
          default:
            handleError(res);
            return null;
        }
      default:
        handleError(res);
        return null;
    }
  };

  const authorizePlex = async (key, code, redirectURI) => {
    const body = { key: key, code: code, redirectURI: redirectURI };
    const res = await executeRequest(
      methods.POST,
      "/sign-in/plex/authorize/",
      body
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const confirmSignInWithPlex = async (search) => {
    const res = await executeRequest(
      methods.GET,
      "/sign-in/plex/confirm/" + search
    );
    switch (res.status) {
      case 200:
        initSession(res.data.username, res.data["avatar"]);
        return res;
      default:
        clearSession();
        handleError(res);
        return null;
    }
  };

  const signOut = async () => {
    await executeRequest(methods.GET, "/sign-out/");
    clearSession();
    props.history.push(routes.SIGN_IN.url);
  };

  const signUp = async (data) => {
    const fd = new FormData();
    fd.append("username", data["username"]);
    fd.append("email", data["email"]);
    fd.append("password", data["password"]);
    const res = await executeRequest(methods.POST, "/sign-up/", fd);
    switch (res.status) {
      case 200:
        return res;
      case 409:
        pushDanger(res.message);
        return res;
      default:
        return null;
    }
  };

  const confirmEmail = async (token) => {
    const res = await executeRequest(
      methods.GET,
      "/sign-up/confirm/" + token + "/"
    );
    switch (res.status) {
      case 200:
        clearSession();
        return res;
      case 403:
      case 410:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const resendConfirmation = async (email) => {
    const fd = new FormData();
    fd.append("email", email);
    const res = await executeRequest(methods.POST, "/sign-up/resend/", fd);
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const setUsername = (username) => {
    Cookies.set("username", username);
    setSession({ ...session, username: username });
  };

  const setAvatar = (avatar) => {
    Cookies.set("avatar", avatar);
    setSession({ ...session, avatar: avatar });
  };

  const handleError = (error) => {
    switch (error.status) {
      case 401:
        clearSession();
        const redirectUri = props.location.pathname;
        props.history.push(routes.SIGN_IN.url + "?redirectURI=" + redirectUri);
        break;
      case 404:
        props.history.push(routes.NOT_FOUND.url);
        break;
      default:
        pushDanger("An error occurred ...");
        return;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        clearSession,
        signIn,
        signInWithPlex,
        signOut,
        signUp,
        confirmEmail,
        resendConfirmation,
        setUsername,
        setAvatar,
        handleError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export { AuthContext, AuthContextWithRouterProvider };
