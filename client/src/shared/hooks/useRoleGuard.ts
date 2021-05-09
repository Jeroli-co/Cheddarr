import { useSession } from "../contexts/SessionContext";
import { useHistory } from "react-router-dom";
import { checkRole } from "../../utils/roles";
import { Roles } from "../enums/Roles";
import { routes } from "../../router/routes";
import { useEffect } from "react";

export const useRoleGuard = (neededRoles: Roles[]) => {
  const {
    session: { user },
  } = useSession();

  const history = useHistory();

  useEffect(() => {
    if (!user || !checkRole(user.roles, neededRoles)) {
      history.push(routes.HOME.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
