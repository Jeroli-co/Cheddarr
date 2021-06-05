import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IUser } from "../models/IUser";
import { useSession } from "../contexts/SessionContext";
import { useUserService } from "../toRefactor/useUserService";
import { checkRole } from "../../utils/roles";
import { Roles } from "../enums/Roles";

export const useUser = (id?: string) => {
  const [currentUser, setCurrentUser] = useState<IAsyncCall<IUser | null>>(
    DefaultAsyncCall
  );
  const {
    session: { user },
  } = useSession();
  const { getUserById } = useUserService();

  useEffect(() => {
    if (id && user && checkRole(user.roles, [Roles.MANAGE_USERS])) {
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
