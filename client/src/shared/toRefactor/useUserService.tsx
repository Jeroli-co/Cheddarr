import { useAPI } from "../hooks/useAPI";
import { useAlert } from "../contexts/AlertContext";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { MESSAGES } from "../enums/Messages";
import { useSession } from "../contexts/SessionContext";
import { APIRoutes } from "../enums/APIRoutes";
import { routes } from "../../router/routes";
import { useHistory } from "react-router";
import { IUser } from "../models/IUser";

export interface IChangePasswordModel {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}

export const useUserService = () => {
  const { patch, remove } = useAPI();
  const { pushDanger, pushSuccess } = useAlert();
  const { updateUsername: updateSession, invalidSession } = useSession();
  const history = useHistory();

  const updateUsername = (username: string) => {
    return patch<IUser>(APIRoutes.UPDATE_USER, { username: username }).then(
      (res) => {
        if (res.status === 200) {
          updateSession(username);
          pushSuccess(MESSAGES.USERNAME_CHANGED);
        } else if (res.status === 409) {
          pushDanger(ERRORS_MESSAGE.USER_ALREADY_EXIST);
        } else {
          pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
        }
        return res;
      }
    );
  };

  const updateEmail = (email: string) => {
    return patch<IUser>(APIRoutes.UPDATE_USER, { email: email }).then((res) => {
      if (res.status === 200) {
        pushSuccess("Email changed");
      } else if (res.status === 409) {
        pushDanger("Email already exist");
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
      return res;
    });
  };

  const updatePassword = (password: IChangePasswordModel) => {
    patch<IUser>(APIRoutes.UPDATE_USER, password).then((res) => {
      if (res.status === 200) {
        pushSuccess("Password changed");
        invalidSession();
        history.push(routes.SIGN_IN.url(routes.PROFILE.url));
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
      return res;
    });
  };

  const updateUserById = (
    id: number,
    payload: object,
    errorMessage?: string,
    successMessage?: string
  ) => {
    return patch<IUser>(APIRoutes.UPDATE_USER_BY_ID(id), payload).then(
      (res) => {
        if (res.status === 200) {
          pushSuccess(
            successMessage !== undefined ? successMessage : "User updated"
          );
        } else {
          pushDanger(
            errorMessage !== undefined ? errorMessage : "Cannot update user"
          );
        }
        return res;
      }
    );
  };

  const deleteUser = (id: number) => {
    return remove(APIRoutes.UPDATE_USER_BY_ID(id)).then((res) => {
      if (res.status === 200) {
        pushSuccess("User deleted");
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
      return res;
    });
  };

  const deleteAccount = () => {
    return remove(APIRoutes.DELETE_ACCOUNT).then((res) => {
      if (res.status === 200) {
        pushSuccess("Account deleted");
        invalidSession();
        history.push(routes.SIGN_IN.url());
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
      return res;
    });
  };

  return {
    updateUsername,
    updateEmail,
    updatePassword,
    updateUserById,
    deleteAccount,
    deleteUser,
  };
};
