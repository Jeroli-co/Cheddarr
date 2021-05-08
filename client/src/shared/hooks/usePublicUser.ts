import { useEffect, useState } from "react";
import { IUser } from "../models/IUser";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";

const usePublicUser = (username: string) => {
  const [publicUser, setPublicUser] = useState<IAsyncCall<IUser | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  useEffect(() => {
    get<IUser>(APIRoutes.GET_PUBLIC_USER(username)).then((res) =>
      setPublicUser(res)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return publicUser;
};

export { usePublicUser };
