import { useEffect, useState } from "react";
import { IPublicUser } from "../models/IPublicUser";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";

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
