import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { ISeason } from "../models/IMedia";
import { useAlert } from "../contexts/AlertContext";

export const useSeason = (seriesId: number, seasonNumber: number) => {
  const [season, setSeason] = useState<IAsyncCall<ISeason | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  useEffect(() => {
    get<ISeason>(APIRoutes.GET_SEASON(seriesId, seasonNumber)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get season");
      } else {
        setSeason(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId, seasonNumber]);

  return season;
};
