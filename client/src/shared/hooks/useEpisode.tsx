import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IEpisode } from "../models/IMedia";

export const useEpisode = (
  seriesId: string,
  seasonNumber: number,
  episodeNumber: number
) => {
  const [episode, setEpisode] = useState<IAsyncCall<IEpisode | null>>({
    ...DefaultAsyncCall,
    isLoading: false,
  });
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchEpisode = () => {
    get<IEpisode>(
      APIRoutes.GET_EPISODE(seriesId, seasonNumber, episodeNumber)
    ).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get episode");
      } else {
        setEpisode(res);
      }
    });
  };

  useEffect(() => {
    if (!episode.isLoading) {
      setEpisode(DefaultAsyncCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeNumber]);

  useEffect(() => {
    if (episode.isLoading) {
      fetchEpisode();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.isLoading]);

  return episode;
};
