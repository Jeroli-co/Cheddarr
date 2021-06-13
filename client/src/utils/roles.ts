import { Roles } from "../shared/enums/Roles";

export const checkRole = (
  userRole: Roles,
  roles: Roles[],
  hasOne?: boolean
) => {
  if (userRole === Roles.ADMIN) {
    return true;
  }

  if (!hasOne) {
    return roles.every((r) => userRole & r);
  } else {
    console.log(roles);
    console.log(userRole);
    console.log(roles.some((r) => userRole & r));
    return roles.some((r) => userRole & r);
  }
};

export const calcRolesSumExceptAdmin = () => {
  let sum = 0;
  Object.values(Roles).forEach((r) => {
    if (typeof r == "number" && r > Roles.ADMIN) {
      sum += r;
    }
  });
  return sum;
};
