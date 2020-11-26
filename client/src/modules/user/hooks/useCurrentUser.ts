import { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { IUser } from "../models/IUser";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    UserService.GetCurrentUser().then((res) => {
      const user = res.data;
      if (user) {
        setCurrentUser(user);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, []);

  return currentUser;
};

export { useCurrentUser };
