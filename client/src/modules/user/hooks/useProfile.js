import { useContext } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";
import { routes } from "../../../router/routes";
import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";

const useProfile = () => {
  const profileURI = "/user";

  const { invalidSession } = useContext(AuthContext);
  const { pushInfo } = useContext(NotificationContext);
  const history = useHistory();

  const changeEmail = async (data) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PUT,
      profileURI,
      data
    );
    switch (res.status) {
      case 200:
        pushInfo("Please check your email to confirm it.");
        return res;
      case 409:
        return res;
      default:
        return null;
    }
  };

  const changePassword = async (data) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PUT,
      profileURI + "password",
      {
        oldPassword: data["oldPassword"],
        newPassword: data["newPassword"],
      }
    );
    switch (res.status) {
      case 200:
        pushInfo("Password changed. Please sign in again.");
        invalidSession();
        return res;
      case 400:
        return res;
      default:
        return null;
    }
  };

  const initResetPassword = async (data) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PUT,
      profileURI + "password",
      {
        email: data["email"],
      }
    );
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        return null;
    }
  };

  const checkResetPasswordToken = async (token) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      profileURI + "password/" + token
    );
    switch (res.status) {
      case 200:
      case 403:
      case 410:
        return res;
      default:
        return null;
    }
  };

  const resetPassword = async (token, data) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.POST,
      profileURI + "password/" + token,
      { password: data["password"] }
    );
    switch (res.status) {
      case 200:
        pushInfo("Password changed. Please sign in again.");
        history.push(routes.SIGN_IN.url);
        return res;
      default:
        return null;
    }
  };

  const deleteAccount = async (data) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      profileURI
    );
    switch (res.status) {
      case 200:
        pushInfo("Your account has been deleted");
        invalidSession();
        return res;
      case 400:
        return res;
      default:
        return null;
    }
  };

  const getUsersProviders = async (type) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      "/users/?provides=" + type
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        return null;
    }
  };

  return {
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
