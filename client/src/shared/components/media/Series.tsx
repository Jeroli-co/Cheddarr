import React from "react";
import { useParams } from "react-router";
import { CenteredContent } from "../layout/CenteredContent";
import { Spinner } from "../Spinner";
import { SwitchErrors } from "../errors/SwitchErrors";
import { Media } from "./Media";
import { useSeries } from "../../hooks/useSeries";
import { PrimaryDivider } from "../Divider";
import { H2 } from "../Titles";
import { Row } from "../layout/Row";
import { MediaPreviewCard } from "./MediaPreviewCard";
import { Season } from "./Season";

type SeriesParams = {
  id: string;
  seasonNumber?: string;
  episodeNumber?: string;
};

export const Series = () => {
  const { id, seasonNumber, episodeNumber } = useParams<SeriesParams>();
  
  if (!id) {
    throw new Error('Series needs an ID')
  }
  
  const series = useSeries(id);

  if (series.isLoading) {
    return (
      <CenteredContent height="100%">
        <Spinner />
      </CenteredContent>
    );
  }

  if (series.data === null) {
    return <SwitchErrors status={series.status} />;
  }

  return (
    <>
      <Media media={series.data} />
      <PrimaryDivider />
      <H2>Seasons</H2>
      <Row>
        {series.data &&
          series.data.seasons &&
          series.data.seasons.map((season) => (
            <MediaPreviewCard key={season.seasonNumber} media={season} />
          ))}
      </Row>
      {series.data && seasonNumber && (
        <>
          <PrimaryDivider />
          <Season
            seriesId={series.data.tmdbId}
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

export default Series
