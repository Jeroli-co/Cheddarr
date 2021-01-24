import { useEffect, useState } from "react";
import { IUser } from "../pages/user-profile/models/IUser";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<IAsyncCall<IUser | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  useEffect(() => {
    get<IUser>(APIRoutes.GET_CURRENT_USER).then((res) => setCurrentUser(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentUser;
};

export { useCurrentUser };
