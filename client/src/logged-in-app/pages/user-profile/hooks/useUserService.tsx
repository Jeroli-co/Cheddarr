import { useAPI } from "../../../../shared/hooks/useAPI";
import { useAlert } from "../../../../shared/contexts/AlertContext";
import { ERRORS_MESSAGE } from "../../../../shared/enums/ErrorsMessage";
import { MESSAGES } from "../../../../shared/enums/Messages";
import { useSession } from "../../../../shared/contexts/SessionContext";
import { IUser } from "../models/IUser";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { useLocation } from "react-router-dom";

export interface IChangePasswordModel {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}

export const useUserService = () => {
  const { patch, remove } = useAPI();
  const { pushDanger, pushSuccess } = useAlert();
  const { updateUsername: updateSession, invalidSession } = useSession();
  const location = useLocation();

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
        invalidSession(location.pathname);
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
    deleteAccount,
  };
};
