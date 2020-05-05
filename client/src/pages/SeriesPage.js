import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Spinner } from "../elements/Spinner";
import { ColumnLayout, RowLayout } from "../elements/layouts";
import { MediaExtendedCardHead } from "../widgets/media-recently-added/elements/MediaExtendedCardHead";
import { Tag, TagColor } from "../elements/Tag";
import { Actors } from "../widgets/media-recently-added/elements/Actors";
import { usePlex } from "../hooks/usePlex";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { routes } from "../router/routes";

const MediaExtendedCardStyle = styled.div`
  margin: 0;
  padding: 1%;
`;

const MediaDetailsPoster = styled.img`
  width: 20%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsInfo = styled.div`
  padding-left: 1%;
  padding-right: 1%;
`;

const SeriesPage = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const { getSeries } = usePlex();

  useEffect(() => {
    getSeries(id).then((s) => {
      console.log(s);
      if (s) setSeries(s);
    });
  }, [id]);

  if (!series || series.id !== id)
    return (
      <Spinner
        justifyContent="center"
        color="primary"
        size="2x"
        padding="1em"
      />
    );

  return (
    <MediaExtendedCardStyle>
      <RowLayout alignItems="flex-start">
        <MediaDetailsPoster src={series.thumbUrl} alt={series.title} />
        <MediaDetailsInfo>
          <MediaExtendedCardHead media={series} />

          <RowLayout childMarginTop="1em">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{series.summary}</div>
            </div>
          </RowLayout>

          <RowLayout
            alignItems="space-between"
            marginTop="1em"
            childMarginRight="1%"
          >
            <ColumnLayout width="20%">
              <p className="is-size-6">Studio</p>
              <p className="is-size-7">{series.studio}</p>
            </ColumnLayout>

            <ColumnLayout>
              <p className="is-size-6">Genres</p>
              <RowLayout childMarginRight="1%" wrap="wrap">
                {series.genres.map((genre, index) => (
                  <Tag key={index} type={TagColor.INFO} content={genre.name} />
                ))}
              </RowLayout>
            </ColumnLayout>
          </RowLayout>
        </MediaDetailsInfo>
      </RowLayout>
      <hr />
      <div className="is-size-5">Seasons</div>
      <RowLayout childMarginRight="8%" wrap="wrap">
        {series.seasons.map((season) => (
          <Link
            key={season.id}
            to={routes.SEASON.url(season.seriesId, season.seasonNumber)}
          >
            {"Season " + season.seasonNumber}
          </Link>
        ))}
      </RowLayout>
      <hr />
      <Actors actors={series.actors} />
    </MediaExtendedCardStyle>
  );
};

export { SeriesPage };
