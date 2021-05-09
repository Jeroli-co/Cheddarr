import { Roles } from "../shared/enums/Roles";

export const checkRole = (userRole: Roles, roles: Roles[]) => {
  if (userRole === Roles.ADMIN) {
    return true;
  }

  return roles.every((r) => userRole & r);
};
