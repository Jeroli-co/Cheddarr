import { useEffect, useState } from "react";
import { IPublicUser } from "../models/IPublicUser";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";

export const useFriendsSeriesProviders = () => {
  const [friendsSeriesProviders, setFriendsSeriesProviders] = useState<
    IAsyncCall<IPublicUser[] | null>
  >(DefaultAsyncCall);

  const { get } = useAPI();

  useEffect(() => {
    get<IPublicUser[]>(APIRoutes.GET_FRIENDS_SERIES_PROVIDERS).then((res) => {
      setFriendsSeriesProviders(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return friendsSeriesProviders;
};
