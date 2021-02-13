import { useEffect, useState } from "react";
import { IPublicUser } from "../models/IPublicUser";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

export const useFriendsMoviesProviders = () => {
  const [friendsMoviesProviders, setFriendsMoviesProviders] = useState<
    IAsyncCall<IPublicUser[] | null>
  >(DefaultAsyncCall);

  const { get } = useAPI();

  useEffect(() => {
    get<IPublicUser[]>(APIRoutes.GET_FRIENDS_MOVIES_PROVIDERS).then((res) => {
      setFriendsMoviesProviders(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return friendsMoviesProviders;
};
