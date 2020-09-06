import { useApi } from "./useApi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { routes } from "../router/routes";
import { useHistory } from "react-router";

const useProfile = () => {
  const profileURI = "/profile/";

  const { executeRequest, methods } = useApi();
  const { handleError, clearSession, setUsername } = useContext(AuthContext);
  const { pushSuccess, pushInfo } = useContext(NotificationContext);
  const history = useHistory();

  const getUser = async () => {
    const res = await executeRequest(methods.GET, profileURI);
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUsername = async (data) => {
    const fd = new FormData();
    fd.append("username", data["newUsername"]);
    const res = await executeRequest(methods.PUT, profileURI + "username/", fd);
    switch (res.status) {
      case 200:
        const username = res.data.username;
        setUsername(username);
        pushSuccess("Username has changed");
        return res;
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeEmail = async (data) => {
    const fd = new FormData();
    fd.append("email", data["email"]);
    const res = await executeRequest(methods.PUT, profileURI + "email/", fd);
    switch (res.status) {
      case 200:
        pushInfo("Please check your email to confirm it.");
        return res;
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changePassword = async (data) => {
    const fd = new FormData();
    fd.append("oldPassword", data["oldPassword"]);
    fd.append("newPassword", data["newPassword"]);
    const res = await executeRequest(methods.PUT, profileURI + "password/", fd);
    switch (res.status) {
      case 200:
        pushInfo("Password changed. Please sign in again.");
        clearSession();
        return res;
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const initResetPassword = async (data) => {
    const fd = new FormData();
    fd.append("email", data["email"]);
    const res = await executeRequest(
      methods.POST,
      profileURI + "password/reset/",
      fd
    );
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const checkResetPasswordToken = async (token) => {
    const res = await executeRequest(
      methods.GET,
      profileURI + "password/reset/" + token + "/"
    );
    switch (res.status) {
      case 200:
      case 403:
      case 410:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const resetPassword = async (token, data) => {
    const fd = new FormData();
    fd.append("password", data["password"]);
    const res = await executeRequest(
      methods.POST,
      profileURI + "password/reset/" + token + "/",
      fd
    );
    switch (res.status) {
      case 200:
        pushInfo("Password changed. Please sign in again.");
        history.push(routes.SIGN_IN.url);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteAccount = async (data) => {
    const fd = new FormData();
    fd.append("password", data["password"]);
    const res = await executeRequest(methods.DELETE, profileURI, fd);
    switch (res.status) {
      case 200:
        pushInfo("Your account has been deleted");
        clearSession();
        return res;
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getUser,
    changeUsername,
    changeEmail,
    changePassword,
    initResetPassword,
    checkResetPasswordToken,
    resetPassword,
    deleteAccount,
  };
};

export { useProfile };
