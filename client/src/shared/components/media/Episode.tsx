import React, { useEffect, useRef } from "react";
import { Spinner } from "../Spinner";
import { SwitchErrors } from "../errors/SwitchErrors";
import { Media } from "./Media";
import { useEpisode } from "../../hooks/useEpisode";

type EpisodeProps = {
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
};

export const Episode = (props: EpisodeProps) => {
  const episode = useEpisode(
    props.seriesId,
    props.seasonNumber,
    props.episodeNumber
  );
  const episodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (episodeRef.current) {
      episodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [episode.data]);

  if (episode.isLoading) {
    return <Spinner />;
  }

  if (episode.data === null) {
    return <SwitchErrors status={episode.status} />;
  }

  return <Media mediaRef={episodeRef} media={episode.data} />;
};
