import { useEffect, useRef } from "react";
import { Spinner } from "../shared/components/Spinner";
import { Media } from "../shared/components/media/Media";
import { IEpisode } from "../shared/models/IMedia";
import { useAPI } from "../shared/hooks/useAPI";
import { useAlert } from "../shared/contexts/AlertContext";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

const useEpisode = (
  seriesId: string,
  seasonNumber: number,
  episodeNumber: number,
) => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchEpisode = () => {
    return get<IEpisode>(
      APIRoutes.GET_EPISODE(seriesId, seasonNumber, episodeNumber),
    ).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get episode");
        return undefined;
      } else {
        return res.data;
      }
    });
  };

  const { data, isLoading, error } = useQuery<IEpisode>(
    ["episode", seriesId, seasonNumber, episodeNumber],
    fetchEpisode,
    {
      staleTime: hoursToMilliseconds(24),
    },
  );

  return {
    data,
    isLoading,
    error,
  };
};

type EpisodeProps = {
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
};

export const Episode = ({
  seriesId,
  seasonNumber,
  episodeNumber,
}: EpisodeProps) => {
  const { data, isLoading } = useEpisode(seriesId, seasonNumber, episodeNumber);
  const episodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (episodeRef.current) {
      episodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  return <Media mediaRef={episodeRef} media={data} />;
};
