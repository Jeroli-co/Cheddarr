import { useAPI } from "../hooks/useAPI";
import { useAlert } from "../contexts/AlertContext";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
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
  const { get, patch, remove } = useAPI();
  const { pushDanger, pushSuccess } = useAlert();
  const {
    session: { user },
    updateUser,
    invalidSession,
  } = useSession();
  const history = useHistory();

  const getUserById = (id: number) => {
    return get<IUser>(APIRoutes.USER_BY_ID(id)).then((res) => res);
  };

  const updateUserById = (
    id: number,
    payload: object,
    errorMessage?: string,
    successMessage?: string
  ) => {
    return patch<IUser>(APIRoutes.USER_BY_ID(id), payload).then((res) => {
      if (res.status === 200 && res.data) {
        if (user && user.id === id) {
          updateUser(res.data);
        }
        pushSuccess(
          successMessage !== undefined ? successMessage : "User updated"
        );
      } else {
        pushDanger(
          errorMessage !== undefined ? errorMessage : "Cannot update user"
        );
      }
      return res;
    });
  };

  const deleteUser = (id: number) => {
    return remove(APIRoutes.USER_BY_ID(id)).then((res) => {
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
    getUserById,
    updateUserById,
    deleteAccount,
    deleteUser,
  };
};
