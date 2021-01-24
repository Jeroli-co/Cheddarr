import { useEffect, useState } from "react";
import { IPublicUser } from "../models/IPublicUser";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

const usePublicUser = (username: string) => {
  const [publicUser, setPublicUser] = useState<IAsyncCall<IPublicUser | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  useEffect(() => {
    get<IPublicUser>(APIRoutes.GET_PUBLIC_USER(username)).then((res) =>
      setPublicUser(res)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return publicUser;
};

export { usePublicUser };
