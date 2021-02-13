import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IUser } from "../models/IUser";

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
