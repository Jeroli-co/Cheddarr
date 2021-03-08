import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { ISeason } from "../models/IMedia";
import { useAlert } from "../contexts/AlertContext";

export const useSeason = (seriesId: string, seasonNumber: number) => {
  const [season, setSeason] = useState<IAsyncCall<ISeason | null>>({
    ...DefaultAsyncCall,
    isLoading: false,
  });
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchSeason = () => {
    get<ISeason>(APIRoutes.GET_SEASON(seriesId, seasonNumber)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get season");
      } else {
        setSeason(res);
      }
    });
  };

  useEffect(() => {
    if (!season.isLoading) {
      setSeason(DefaultAsyncCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonNumber]);

  useEffect(() => {
    if (season.isLoading) {
      fetchSeason();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season.isLoading]);

  return season;
};
