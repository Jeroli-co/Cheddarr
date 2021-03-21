import React, { useEffect, useRef } from "react";
import { useSeason } from "../../hooks/useSeason";
import { Media } from "./Media";
import { Spinner } from "../Spinner";
import { SwitchErrors } from "../errors/SwitchErrors";
import { H2 } from "../Titles";
import { Row } from "../layout/Row";
import { MediaPreviewCard } from "./MediaPreviewCard";
import { Episode } from "./Episode";

type SeasonProps = {
  seriesId: string;
  seasonNumber: number;
  episodeNumber?: number;
};

export const Season = (props: SeasonProps) => {
  const season = useSeason(props.seriesId, props.seasonNumber);
  const seasonRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (seasonRef.current) {
      seasonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [season.data]);

  if (season.isLoading) {
    return <Spinner />;
  }

  if (season.data === null) {
    return <SwitchErrors status={season.status} />;
  }

  return (
    <>
      <Media mediaRef={seasonRef} media={season.data} />
      <H2>Episodes</H2>
      <Row>
        {season.data &&
          season.data.episodes &&
          season.data.episodes.map((episode) => (
            <MediaPreviewCard key={episode.episodeNumber} media={episode} />
          ))}
      </Row>
      {season.data && props.episodeNumber && (
        <>
          <Episode
            seriesId={props.seriesId}
            seasonNumber={props.seasonNumber}
            episodeNumber={props.episodeNumber}
          />
        </>
      )}
    </>
  );
};
