import { useSession } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { checkRole } from "../../utils/roles";
import { Roles } from "../enums/Roles";
import { routes } from "../../routes";
import { useEffect } from "react";

export const useRoleGuard = (neededRoles: Roles[], hasOne?: boolean) => {
  const {
    session: { user },
  } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !checkRole(user.roles, neededRoles, hasOne)) {
      navigate(routes.HOME.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
