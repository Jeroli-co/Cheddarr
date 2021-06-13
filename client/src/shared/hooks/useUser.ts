import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IUser } from "../models/IUser";
import { useSession } from "../contexts/SessionContext";
import { useUserService } from "../toRefactor/useUserService";

export const useUser = (id?: string) => {
  const [currentUser, setCurrentUser] = useState<IAsyncCall<IUser | null>>(
    DefaultAsyncCall
  );
  const {
    session: { user },
  } = useSession();
  const { getUserById } = useUserService();

  useEffect(() => {
    if (id && user && id !== user.id.toString(10)) {
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
