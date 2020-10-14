import { useContext } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { NotificationContext } from "../../../notifications/contexts/NotificationContext";
import { routes } from "../../../../router/routes";
import { useApi } from "../../../api/hooks/useApi";

const useProfile = () => {
  const profileURI = "/me/";

  const { executeRequest, methods } = useApi();
  const { handleError, clearSession, setUsername } = useContext(AuthContext);
  const { pushSuccess, pushInfo } = useContext(NotificationContext);
  const history = useHistory();

  const getUser = async (username) => {
    let res = null;
    if (username === null) {
      res = await executeRequest(methods.GET, profileURI);
    } else {
      res = await executeRequest(methods.GET, "/users/" + username);
    }
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUsername = async (data) => {
    const res = await executeRequest(methods.PUT, profileURI, data);
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
    const res = await executeRequest(methods.PUT, profileURI, data);
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
    const res = await executeRequest(methods.PUT, profileURI + "password/", {
      oldPassword: data["oldPassword"],
      newPassword: data["newPassword"],
    });
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
    const res = await executeRequest(methods.PUT, profileURI + "password", {
      email: data["email"],
    });
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
      profileURI + "password/" + token
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
    const res = await executeRequest(
      methods.POST,
      profileURI + "password/" + token,
      { password: data["password"] }
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
    const res = await executeRequest(methods.DELETE, profileURI);
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

  const getUsersProviders = async (type) => {
    const res = await executeRequest(methods.GET, "/users/?provides=" + type);
    switch (res.status) {
      case 200:
        return res.data;
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
    getUsersProviders,
  };
};

export { useProfile };
