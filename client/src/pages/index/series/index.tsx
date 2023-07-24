import * as React from "react";
import { useParams } from "react-router";
import { Media } from "../../../shared/components/media/Media";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { H2 } from "../../../shared/components/Titles";
import { Row } from "../../../shared/components/layout/Row";
import { MediaPreviewCard } from "../../../shared/components/media/MediaPreviewCard";
import { Season } from "../../../shared/components/media/Season";
import { useSeries } from "../../../hooks/useSeries";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { id, seasonNumber, episodeNumber } = useParams<{
    id: string;
    seasonNumber?: string;
    episodeNumber?: string;
  }>();

  const { data, isLoading } = useSeries(id);

  if (isLoading) {
    return undefined;
  }

  return (
    <>
      <Media media={data} />
      <PrimaryDivider />
      <H2>Seasons</H2>
      <Row>
        {data?.seasons?.map((season) => (
          <MediaPreviewCard key={season.seasonNumber} media={season} />
        ))}
      </Row>
      {data && seasonNumber && (
        <>
          <PrimaryDivider />
          <Season
            seriesId={data.tmdbId}
            seasonNumber={parseInt(seasonNumber, 10)}
            episodeNumber={
              episodeNumber ? parseInt(episodeNumber, 10) : undefined
            }
          />
        </>
      )}
    </>
  );
};
