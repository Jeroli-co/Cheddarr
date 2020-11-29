import { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { IPublicUser } from "../models/IPublicUser";

const usePublicUser = (id: string) => {
  const [publicUser, setPublicUser] = useState<IPublicUser | null>(null);

  useEffect(() => {
    UserService.GetPublicUser(id).then((res) => {
      if (res.data) {
        setPublicUser(res.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return publicUser;
};

export { usePublicUser };
