import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IEpisode } from "../models/IMedia";

export const useEpisode = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const [episode, setEpisode] = useState<IAsyncCall<IEpisode | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  useEffect(() => {
    get<IEpisode>(
      APIRoutes.GET_EPISODE(seriesId, seasonNumber, episodeNumber)
    ).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get episode");
      } else {
        setEpisode(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId, seasonNumber, episodeNumber]);

  return episode;
};
