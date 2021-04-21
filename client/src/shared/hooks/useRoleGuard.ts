import { useSession } from "../contexts/SessionContext";
import { useHistory } from "react-router-dom";
import { checkRole } from "../../utils/roles";
import { Roles } from "../enums/Roles";
import { routes } from "../../router/routes";
import { useEffect } from "react";

export const useRoleGuard = (neededRoles: Roles[], hasOne?: boolean) => {
  const {
    session: { roles },
  } = useSession();

  const history = useHistory();

  useEffect(() => {
    if (!checkRole(roles, neededRoles, hasOne)) {
      history.push(routes.NOT_FOUND.url); // TODO: Replace with 403
    }
  }, []);
};
