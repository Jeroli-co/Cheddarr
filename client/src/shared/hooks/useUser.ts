import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IUser } from "../models/IUser";
import { useSession } from "../contexts/SessionContext";
import { useRoleGuard } from "./useRoleGuard";
import { Roles } from "../enums/Roles";
import { useUserService } from "../toRefactor/useUserService";

export const useUser = (id?: string) => {
  const [currentUser, setCurrentUser] = useState<IAsyncCall<IUser | null>>(
    DefaultAsyncCall
  );
  const {
    session: { user },
  } = useSession();
  const { getUserById } = useUserService();

  useRoleGuard([Roles.MANAGE_USERS]);

  useEffect(() => {
    if (id) {
      getUserById(parseInt(id, 10)).then((res) => {
        if (res.status === 200) {
          setCurrentUser(res);
        }
      });
    } else if (user) {
      setCurrentUser({ isLoading: false, data: user, status: 200 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const updateUser = (user: IUser) => {
    setCurrentUser({ ...currentUser, data: user });
  };

  return { currentUser, updateUser };
};
