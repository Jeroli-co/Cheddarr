import { Roles } from "../enums/Roles";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IUser } from "../models/IUser";

export const useRoles = () => {
  const { patch } = useAPI();
  const { pushDanger, pushSuccess } = useAlert();

  const updateRoles = (id: number, role: Roles) => {
    return patch<IUser>(APIRoutes.UPDATE_USER_BY_ID(id), {
      roles: role,
    }).then((res) => {
      if (res.status === 200) {
        pushSuccess("Role updated");
      } else {
        pushDanger("Cannot update role");
      }
      return res;
    });
  };

  return {
    updateRoles,
  };
};
