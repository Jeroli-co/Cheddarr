import { useEffect, useState } from "react";
import { IUser } from "../models/IUser";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";

export const useFriendsSeriesProviders = () => {
  const [friendsSeriesProviders, setFriendsSeriesProviders] = useState<
    IAsyncCall<IUser[] | null>
  >(DefaultAsyncCall);

  const { get } = useAPI();

  useEffect(() => {
    get<IUser[]>(APIRoutes.GET_FRIENDS_SERIES_PROVIDERS).then((res) => {
      setFriendsSeriesProviders(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return friendsSeriesProviders;
};
