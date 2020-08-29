import React, { createContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { routes } from "../router/routes";
import Cookies from "js-cookie";
import { useApi } from "../hooks/useApi";

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

  useEffect(() => {
    if (props.location.pathname === routes.AUTHORIZE_PLEX.url) {
      authorizePlex(props.location.search).then((res) => {
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
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const signInWithPlex = async (redirectURI) => {
    const res = await executeRequest(
      methods.GET,
      "/sign-in/plex/?redirectURI=" + redirectURI
    );
    switch (res.status) {
      case 200:
        window.location.href = res.headers.location;
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const authorizePlex = async (search) => {
    const res = await executeRequest(
      methods.GET,
      "/sign-in/plex/authorize/" + search
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
    return await executeRequest(methods.POST, "/sign-up/", fd);
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

  const setavatar = (avatar) => {
    Cookies.set("avatar", avatar);
    setSession({ ...session, avatar: avatar });
  };

  const handleError = (error) => {
    const fatalError = () => {
      clearSession();
      props.history.push(routes.HOME.url);
    };

    switch (error.status) {
      case 401:
        clearSession();
        props.history.push(
          routes.SIGN_IN.url + "?redirectURI=" + props.location.pathname
        );
        return;

      case 400:
        props.history.push(routes.BAD_REQUEST.url);
        return;

      case 500:
        props.history.push(routes.INTERNAL_SERVER_ERROR.url);
        return;

      case 404:
        props.history.push(routes.NOT_FOUND.url);
        return;

      default:
        fatalError();
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
        setavatar,
        handleError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export { AuthContext, AuthContextWithRouterProvider };
